<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StatePageController extends Controller
{
    public function index()
    {
        $currentVersion = DB::table('versions')
            ->where('isCurrent', true)
            ->first();

        $state = DB::table('departments')
            ->where('versions_id', $currentVersion->id)
            ->select('id', 'territory', 'name', 'state')
            ->orderBy('name', 'asc')
            ->get();

        // dd($state);

        return Inertia::render('State/Index', [
            'state' => $state
        ]);
    }
}
