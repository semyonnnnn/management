<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Ensure DB is imported
use App\Services\UploadService;

class DepartmentsController extends Controller
{
    protected UploadService $uploadService;

    public function __construct(UploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request)
    {
        // 1. Get the ID of the single "current" version first
        $currentVersion = DB::table('versions')
            ->where('isCurrent', true)
            ->first();

        // 2. If no current version exists, return an empty collection to avoid errors
        if (!$currentVersion) {
            return Inertia::render('Departments/Index', [
                'departments' => [],
                'version_name' => 'No active version'
            ]);
        }

        // 3. Fetch departments strictly for that specific version ID
        $departments = DB::table('departments')
            ->where('versions_id', $currentVersion->id)
            ->select('id', 'name', 'territory', 'staff', 'workload')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'version_name' => $currentVersion->name
        ]);
    }
}