<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
///////////////////////
use App\Services\UploadService;

class DashboardController extends Controller
{
    protected UploadService $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }
    public function index(Request $request)
    {
        return Inertia::render('Dashboard/Index');
    }
    public function uploadFiles(Request $request)
    {
        $this->uploadService->handle($request);
    }
}