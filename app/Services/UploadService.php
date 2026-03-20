<?php

namespace App\Services;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class UploadService
{
    public function handle(Request $request)
    {
        $this->validateUpload($request);
        $this->validateSheetNames($request);
        $data = $this->getData($request);

        dd($data);
    }

    public function validateUpload(Request $request): void
    {
        $messages = [
            'version.required' => 'Название версии обязательно',
            'version.string' => 'Название версии должно быть текстом',
            'matrix.required' => 'Файл матрицы обязателен',
            'matrix.file' => 'Файл матрицы должен быть корректным файлом',
            'matrix.mimes' => 'Файл матрицы должен быть формата .xlsx',
            'forms.required' => 'Файл справочника обязателен',
            'forms.file' => 'Файл справочника должен быть корректным файлом',
            'forms.mimes' => 'Файл справочника должен быть формата .xlsx',
        ];

        $validator = Validator::make(
            $request->all() + $request->allFiles(),
            [
                'version' => ['required', 'string'],
                'matrix' => ['required', 'file', 'mimes:xlsx'],
                'forms' => ['required', 'file', 'mimes:xlsx'],
            ],
            $messages
        );

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }
    }

    protected function validateSheetNames(Request $request): void
    {
        $files = [
            'matrix' => $request->file('matrix'),
            'forms' => $request->file('forms'),
        ];

        $requiredSheets = [
            'matrix' => ['КО', 'СО'],
            'forms' => ['Справочник'],
        ];

        $fileNames = [
            'matrix' => 'файле матрицы',
            'forms' => 'файле справочника',
        ];

        $errors = [];

        foreach ($requiredSheets as $key => $sheets) {
            $file = $files[$key];

            try {
                $reader = new XlsxReader();
                $reader->setReadDataOnly(true);
                
                $spreadsheet = $reader->load($file->getPathname());
                $sheetNames = $spreadsheet->getSheetNames();

                foreach ($sheets as $sheet) {
                    if (!in_array($sheet, $sheetNames)) {
                        $errors[$key][] = "Лист «{$sheet}» не найден в {$fileNames[$key]}.";
                    }
                }

            } catch (\Throwable $e) {
                $errors[$key][] = "Не удалось прочитать {$fileNames[$key]}. Проверьте файл.";
            }
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * Detect "real" data bounds dynamically
     */
    protected function detectDataBounds($sheet, int $maxEmptyRows = 1000): array
    {
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $highestColumnIndex = Coordinate::columnIndexFromString($highestColumn);
    
        $activeColumns = [];
        $activeRows = [];
    
        // Track empty streaks for early exit
        $emptyRowStreak = 0;
    
        for ($row = 1; $row <= $highestRow; $row++) {
            $rowHasData = false;
    
            for ($col = 1; $col <= $highestColumnIndex; $col++) {
                // Convert column index to letter for getCell()
                $columnLetter = Coordinate::stringFromColumnIndex($col);
                $cell = $sheet->getCell($columnLetter . $row);
                $value = $cell->getValue();
                
                if (!is_null($value) && trim((string)$value) !== '') {
                    $rowHasData = true;
                    $activeColumns[$col] = true;
                }
            }
    
            if ($rowHasData) {
                $activeRows[] = $row;
                $emptyRowStreak = 0;
            } else {
                $emptyRowStreak++;
                if ($emptyRowStreak >= $maxEmptyRows) {
                    break;
                }
            }
        }
    
        $activeColumns = array_keys($activeColumns);
        
        // If no active columns found, default to first column
        if (empty($activeColumns)) {
            $activeColumns = [1];
        }
        
        // If no active rows found, default to first row
        if (empty($activeRows)) {
            $activeRows = [1];
        }
    
        return [$activeColumns, $activeRows];
    }

    /**
     * Extract data from a specific sheet with bounds detection
     */
    protected function extractSheetData($sheet): array
    {
        [$columns, $rows] = $this->detectDataBounds($sheet);
        
        $data = [];
        
        foreach ($rows as $row) {
            $rowData = [];
            foreach ($columns as $col) {
                // Convert column index to letter for getCell()
                $columnLetter = Coordinate::stringFromColumnIndex($col);
                $cell = $sheet->getCell($columnLetter . $row);
                $value = $cell->getValue();
                
                // Convert to string and trim for consistency
                $rowData[$col] = !is_null($value) ? trim((string)$value) : null;
            }
            $data[] = $rowData;
        }
        
        return [
            'bounds' => [
                'columns' => $columns,
                'rows' => $rows,
                'column_count' => count($columns),
                'row_count' => count($rows),
            ],
            'data' => $data,
        ];
    }

    protected function getData(Request $request): array
    {
        $files = [
            'matrix' => $request->file('matrix'),
            'forms' => $request->file('forms'),
        ];
        
        $result = [
            'version' => $request->input('version'),
            'files' => [],
        ];
        
        foreach ($files as $fileKey => $file) {
            try {
                $reader = new XlsxReader();
                $reader->setReadDataOnly(true);
                
                $spreadsheet = $reader->load($file->getPathname());
                $sheetNames = $spreadsheet->getSheetNames();
                
                $sheetsData = [];
                
                // Process each sheet in the file
                foreach ($sheetNames as $sheetName) {
                    $sheet = $spreadsheet->getSheetByName($sheetName);
                    if ($sheet) {
                        $sheetsData[$sheetName] = $this->extractSheetData($sheet);
                    }
                }
                
                $result['files'][$fileKey] = [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'sheet_names' => $sheetNames,
                    'sheets' => $sheetsData,
                ];
                
            } catch (\Throwable $e) {
                $result['files'][$fileKey] = [
                    'name' => $file->getClientOriginalName(),
                    'error' => 'Не удалось прочитать файл: ' . $e->getMessage(),
                ];
            }
        }
        
        return $result;
    }
}