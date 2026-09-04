<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/////////////////////////////////////////
use App\Http\Requests\Forms\FormCreateRequest;
use App\Http\Requests\Forms\FormUpdateRequest;
use App\Http\Requests\FileUploadRequest;
use App\Models\Form;
use App\Services\FormService;
use App\Services\FormImportService;
use App\Exceptions\FormImportException;
use App\Repositories\FormRepository;

class FormsController extends Controller
{
    public function index(Request $r, FormService $formService): Response
    {
        $search = (string) $r->input('search', '');
        $territory = $r->input('territory') ? strtolower(trim((string) $r->input('territory'))) : 'all';

        return Inertia::render('Forms/Index', $formService->index($search, $territory));
    }

    public function create(FormCreateRequest $r)
    {
        $data = $r->validated();

        $form = Form::create([
            'okud' => (int) $data['okud'],
            'name' => (string) $data['name'],
            'period' => (string) $data['period'],
            'indicators' => (int) $data['indicators'],
            'k1' => (float) $data['k1'],
            'k2' => (float) $data['k2'],
            'k3' => (float) $data['k3'],
            'k4' => (float) $data['k4'],
            'k5' => (float) $data['k5'],
            'k6' => (float) $data['k6'],
            'is_consolidated' => (bool) ($data['is_consolidated'] ?? false),
        ]);

        $departmentIds = collect($data['departments'] ?? [])
            ->pluck('department_id')
            ->filter()
            ->toArray();

        $form->departments()->sync($departmentIds);

        return redirect()->back();
    }

    //FormUpdateRequest
    public function update(FormUpdateRequest $r)
    {
        $requestForms = $r->validated()['forms'];

        foreach ($requestForms as $key => $formData) {
            $form = Form::findOrFail($formData['id']);
            DB::transaction(function () use ($formData, $form) {

                $form->update([
                    'okud' => (int) $formData['okud'],
                    'name' => (string) $formData['name'],
                    'period' => (string) $formData['period'],
                    'indicators' => (int) $formData['indicators'],
                    'k1' => (float) $formData['k1'],
                    'k2' => (float) $formData['k2'],
                    'k3' => (float) $formData['k3'],
                    'k4' => (float) $formData['k4'],
                    'k5' => (float) $formData['k5'],
                    'k6' => (float) $formData['k6'],
                    'is_consolidated' => (bool) ($data['is_consolidated'] ?? false),
                ]);

                $departmentIds = collect($formData['departments'] ?? [])
                    ->pluck('department_id')
                    ->filter()
                    ->toArray();

                $form->departments()->sync($departmentIds);
            });
        }

        $count = count($requestForms);
        $form_rus = $count == 1 ? 'форме' : 'формах';
        return redirect()->back()->with('success', "Данные в $count $form_rus успешно обновлены!");
    }

    public function delete(int $id)
    {
        $form = Form::find($id);
        $formName = $form->name;
        $form->delete();


        return redirect()->back()->with('success', "Форма $formName успешно удалена!");
    }

    public function upload(
        FileUploadRequest $r,
        FormImportService $importer,
        FormRepository $departments
    ) {
        try {
            $rows = $importer->importFromFile($r->file('file'));
        } catch (FormImportException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        }

        $count = $departments->upsertMany($rows);


        return back()->with('success', "Импортировано {$count} форм!");
    }
}
