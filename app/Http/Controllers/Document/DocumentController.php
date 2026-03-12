<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Services\DocumentService;
use Inertia\Response;
use App\Http\Requests\DocCreate\DocCreateRequest;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('CreateDoc/Index');
    }
    public function generate(DocCreateRequest $request)
    {
        [$pdf, $data] = (new DocumentService)->generate($request);
        return $pdf->download($data . '.pdf');
    }
}