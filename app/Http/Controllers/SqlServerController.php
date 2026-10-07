<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SqlServerController extends Controller
{
    public function index()
    {
        try {
            // Test raw connection by executing SELECT @@VERSION
            $version = DB::connection('sqlsrv')->select('SELECT @@VERSION as version');
            
            // Example table dump (replace 'your_table' with an actual table name)
            // $data = DB::connection('sqlsrv')->table('your_table')->limit(5)->get();

            dd([
                'status' => 'Connection successful!',
                'server_version' => $version[0]->version ?? $version,
            ]);
        } catch (\Exception $e) {
            dd([
                'status' => 'Connection failed!',
                'error' => $e->getMessage(),
            ]);
        }
    }
}