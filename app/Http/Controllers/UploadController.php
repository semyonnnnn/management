<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
///////////////////////
use App\Services\UploadService;
// use App\Services\CalcService;

class UploadController extends Controller
{
    public function index()
    {
        return Inertia::render('UploadFiles/Index');
    }

    public function store(Request $request)
    {
        (new UploadService)->store($request);
        return redirect('/old_forms');
    }

    public function update(Request $request)
    {
        (new UploadService)->update($request);
    }
}
