<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
///////////////////////
use App\Services\UploadFilesService;

class UploadFilesController extends Controller
{
    public function index()
    {
        return Inertia::render('UploadFiles/Index');
    }

    public function store(Request $request)
    {
        (new UploadFilesService)->store($request);
        return redirect('/old_forms');
    }

    public function update(Request $request)
    {
        (new UploadFilesService)->update($request);
    }
}
