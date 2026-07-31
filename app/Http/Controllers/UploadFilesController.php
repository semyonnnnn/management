<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
///////////////////////
use App\Services\UploadFilesService;
use App\Http\Requests\OldUploadRequest;

class UploadFilesController extends Controller
{
    // public function index()
    // {
    //     return Inertia::render('UploadFiles/Index');
    // }

    //OldUploadRequest
    public function store(OldUploadRequest $r)
    {
        (new UploadFilesService)->store($r);
        return back()->with('success', 'Матрица успешно загружена');
    }

    public function update(Request $request)
    {
        (new UploadFilesService)->update($request);
    }
}
