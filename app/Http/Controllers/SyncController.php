<?php

namespace App\Http\Controllers;

use App\Models\ERIS\Ekb_Users;
use App\Models\ERIS\Krg_Users;

class SyncController extends Controller
{

    private array $dep_code = [
        'ekb' => [],
        'krg' => [],
    ];

    public function index()
    {
        // Map over Ekb records and inject the territory attribute
        $deps_Ekb = Ekb_Users::all()->map(function ($item) {
            $item->territory = 'ekb';
            return $item;
        })->toArray();

        // Map over Krg records and inject the territory attribute
        $deps_Krg = Krg_Users::all()->map(function ($item) {
            $item->territory = 'krg';
            return $item;
        })->toArray();

        // Amalgamate both datasets into a single unified array
        $deps = array_merge($deps_Ekb, $deps_Krg);

        dd($deps);
    }
}