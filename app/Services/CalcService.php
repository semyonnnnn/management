<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class CalcService
{
    /**
     * Handle the matrix calculation by sending the file path to the Python microservice.
     */
    public function handle(Request $request)
    {
        // 1. Store the file (Default disk is 'local')
        // In Laravel 11, this goes to: storage/app/private/uploads/
        $path = $request->file('matrix')->store('uploads');

        // 2. Get the absolute path using the Storage facade
        // This ensures the /private/ segment is included in the path
        $absolutePath = Storage::disk('local')->path($path);

        // 3. Send a POST request to the Python container
        // Ensure your docker-compose service name is 'python'
        $response = Http::timeout(60)
            ->post('http://python:5000/process-matrix', [
                'file_path' => $absolutePath,
            ]);

        // 4. Handle the response
        if ($response->successful()) {
            return $response->json();
        }

        // 5. Cleanup the file if Python failed (optional)
        // Storage::delete($path);

        throw new \Exception(
            "Python Service Error (" . $response->status() . "): " . $response->body()
        );
    }
}