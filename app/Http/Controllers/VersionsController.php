<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VersionsController extends Controller
{
    public function index()
    {
        // FIX: Added 'id' to the select statement
        $versions = DB::table('versions')
            ->select('id', 'name', 'created_at as date', 'isCurrent')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($version) {
                return [
                    'id' => $version->id, // This will now work because id was selected
                    'name' => $version->name,
                    'isCurrent' => (bool) $version->isCurrent,
                    'date' => Carbon::parse($version->date)->format('d/m/Y')
                ];
            });

        return Inertia::render('Versions/Index', [
            'versions' => $versions
        ]);
    }

    public function apply($id)
    {
        DB::transaction(function () use ($id) {
            // 1. Set every version to false
            DB::table('versions')->update(['isCurrent' => false, 'updated_at' => now()]);

            // 2. Set the specific version to true
            $affected = DB::table('versions')
                ->where('id', $id)
                ->update([
                    'isCurrent' => true,
                    'updated_at' => now()
                ]);

            if ($affected === 0) {
                throw new \Exception("Version with ID {$id} not found.");
            }
        });

        return redirect()->back()->with('success', 'Версия успешно применена');
    }




    public function destroy($id)
    {
        DB::transaction(function () use ($id) {
            // 1. Delete linked forms first (to avoid foreign key errors)
            DB::table('forms')->where('versions_id', $id)->delete();

            // 2. Delete linked departments
            DB::table('departments')->where('versions_id', $id)->delete();

            // 3. Delete the version
            DB::table('versions')->where('id', $id)->delete();
        });

        return redirect()->back()->with('success', 'Версия удалена');
    }
}