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


    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'staff_map' => 'required|array', // { department_id => staff_count }
            'staff_map.*' => 'integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            // 1. Mark all existing versions as not current
            DB::table('versions')->update([
                'isCurrent' => false,
                'updated_at' => now(),
            ]);

            // 2. Insert the new version
            $versionId = DB::table('versions')->insertGetId([
                'name' => $request->input('name'),
                'isCurrent' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 3. Get the latest previous version (the one that was current before)
            $previousVersion = DB::table('versions')
                ->where('id', '<', $versionId)
                ->orderByDesc('id')
                ->first();

            if ($previousVersion) {
                $staffMap = $request->input('staff_map', []);

                // 4. Clone departments with updated staff
                $departments = DB::table('departments')
                    ->where('versions_id', $previousVersion->id)
                    ->get();

                $newDepartments = [];
                foreach ($departments as $dept) {
                    $newDepartments[] = [
                        'versions_id' => $versionId,
                        'name' => $dept->name,
                        'territory' => $dept->territory,
                        'staff' => isset($staffMap[$dept->id]) ? (int) $staffMap[$dept->id] : $dept->staff,
                        'workload' => $dept->workload,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($newDepartments)) {
                    DB::table('departments')->insert($newDepartments);
                }

                // 5. Clone forms for the new version
                $forms = DB::table('forms')
                    ->where('versions_id', $previousVersion->id)
                    ->get();

                $newForms = [];
                foreach ($forms as $form) {
                    $newForms[] = [
                        'versions_id' => $versionId,
                        'department_id' => $form->department_id,
                        'name' => $form->name,
                        'indicators' => $form->indicators,
                        'reports' => $form->reports,
                        'coeff' => $form->coeff,
                        'final' => $form->final,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($newForms)) {
                    DB::table('forms')->insert($newForms);
                }
            }
        });

        return redirect()->back()->with('success', 'Новая версия успешно создана и применена');
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