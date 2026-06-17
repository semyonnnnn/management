<?php

namespace App\Services;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;



##################################

use App\Http\Requests\DocCreate\DocCreateRequest;

class DocumentService
{


    public function generate(DocCreateRequest $request)
    {
        $attributes = $request->validated();
        $data = $attributes['description'];
        $pdf = PDF::loadView('pdf.template', ['data' => $data]);

        return [$pdf, $data['doc_name']];
        // return $pdf->download($data['doc_name'] . '.pdf');

        // // dd($_GET);
        // //new lines are recognized as \r\n

        // $description = $attributes['description'];

        // $phpWord = new PhpWord();
        // $section = $phpWord->addSection();

        // $tableStyle = [
        //     'alignment' => \PhpOffice\PhpWord\SimpleType\JcTable::END, // right-aligned
        //     'width' => 33 * 50, // one third of page (approx)
        //     'unit' => \PhpOffice\PhpWord\SimpleType\TblWidth::PERCENT,
        //     'borderSize' => 0,
        //     // 'borderColor' => 'ffffff',
        //     'cellMargin' => 0,
        // ];

        // $rowStyle = [
        //     'borderSize' => 0,
        //     // 'borderColor' => 'ffffff',
        // ];

        // $cellStyle = [
        //     'borderSize' => 0,
        //     // 'borderColor' => 'ffffff',
        // ];

        // $phpWord->addTableStyle('noBorderTable', $tableStyle);
        // $table = $section->addTable('noBorderTable');

        // for ($i = 1; $i <= 4; $i++) {
        //     $table->addRow(null, $rowStyle);
        //     $table->addCell(null, $cellStyle)
        //         ->addText("Fake datum {$i}");
        // }





        // $filename = $attributes['doc_name'];
        // $filename .= '.docx';

        // return response()->streamDownload(function () use ($phpWord) {
        //     $writer = IOFactory::createWriter($phpWord, 'Word2007');
        //     $writer->save('php://output');
        // }, $filename, [
        //     'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        //     'Cache-Control' => 'max-age=0',
        // ]);
    }

}