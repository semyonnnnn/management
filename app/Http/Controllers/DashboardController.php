<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
///////////////////////
use App\Services\UploadService;
// use App\Services\CalcService;

class DashboardController extends Controller
{
    protected UploadService $uploadService;
    // protected CalcService $calcService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
        // $this->calcService = $calcService;
    }
    public function index(Request $request)
    {
        return Inertia::render('Dashboard/Index');
    }
    public function uploadFiles(Request $request)
    {
        $this->uploadService->handle($request);
        // $this->calcService->handle($request);
    }
}