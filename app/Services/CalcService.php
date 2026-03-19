<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

class CalcService
{
    public function handle(Request $request)
    {
        // 1. Store the file and get the relative path
        $path = $request->file('matrix')->store('uploads');

        // 2. Get the absolute path that the Docker container understands
        // storage_path('app/' . $path) points to /var/www/html/storage/app/uploads/...
        $absolutePath = storage_path('app/' . $path);

        $scriptPath = '/var/www/html/app/Python/hello.py';

        $payload = [
            'file_path' => $absolutePath,
        ];

        // 3. Execute Python
        $result = Process::run("python3 $scriptPath " . escapeshellarg(json_encode($payload)));

        if ($result->successful()) {
            $output = json_decode($result->output(), true);

            // For now, let's dd to verify the Python output
            dd($output);

            return $output;
        }

        throw new \Exception("Python Error: " . $result->errorOutput());
    }
}