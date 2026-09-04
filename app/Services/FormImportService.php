<?php

// app/Services/DepartmentImportService.php
namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use App\Exceptions\DepartmentImportException;

class FormImportService
{
    public function importFromFile(UploadedFile $file): array
    {
        $response = Http::timeout(10)->attach(
            'file',
            file_get_contents($file->getRealPath()),
            $file->getClientOriginalName()
        )->post('http://python:8000/forms/import');

        if ($response->failed()) {
            throw new DepartmentImportException('Import service unavailable');
        }

        $payload = $response->json();

        if (!empty($payload['errors'])) {
            throw new DepartmentImportException('Some rows failed to import', $payload['errors']);
        }

        return $payload['rows'];
    }
}