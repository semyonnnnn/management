<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SqlServerController extends Controller
{
    public function index()
    {
        // TOP works on 2005; the ? is a bound parameter, never concatenate user input
        $rows = DB::connection('sqlsrv')->select(
            'SELECT TOP 100 * FROM dbo.smart_ecco_2026'
        );
        dd($rows);
    }
}