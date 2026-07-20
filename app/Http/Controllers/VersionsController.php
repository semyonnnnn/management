<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
//////////////////////////
use App\Models\Version;

class VersionsController extends Controller
{
    public function index()
    {
        $versions = Version::query()
            ->latest() // Shortcut for orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Versions/Index', [
            'versions' => $versions->map(fn($version) => [
                'id' => $version->id,
                'name' => $version->name,
                'isCurrent' => $version->isCurrent,
                'date' => $version->created_at?->format('d/m/Y') ?? 'N/A',
            ])
        ]);
    }

    public function update(int|string $id)
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


    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'staff_map' => 'required|array', // { department_id => staff_count }
            'staff_map.*' => 'integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            // 1. Mark all existing version as not current
            DB::table('versions')->update([
                'isCurrent' => false,
                'updated_at' => now(),
            ]);
        });

        return redirect()->back()->with('success', 'Новая версия успешно создана и применена');
    }

    public function delete(int|string $id)
    {
        DB::transaction(function () use ($id) {
            // 1. Delete linked forms first (to avoid foreign key errors)
            DB::table('old_forms')->where('versions_id', $id)->delete();

            // 2. Delete linked departments
            DB::table('old_departments')->where('versions_id', $id)->delete();

            // 3. Delete the version
            DB::table('versions')->where('id', $id)->delete();
        });

        return redirect()->back()->with('success', 'Версия удалена');
    }
}
