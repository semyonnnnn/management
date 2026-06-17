<?php

namespace App\Http\Controllers\File;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Http\Requests\File\FileCreateRequest;
use App\Services\FileService;

class FileController extends Controller
{
    public function index()
    {
    }
    public function create()
    {
        return Inertia::render('File/Index');
    }

    public function store(FileCreateRequest $request)
    {
        (new FileService)->upload($request);

        return redirect()->back()->with('success', 'Files uploaded successfully');
    }
}