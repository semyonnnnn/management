<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
//////////////////////////////
use App\Services\FormService;
use App\Http\Requests\FormRequest;
use App\Models\Form;
use App\Models\Version;

class FormsController extends Controller
{
    public function index(Request $request, FormService $formService): Response
    {
        $search = (string)$request->input('search', '');
        $territory = $request->input('territory') ? strtolower(trim((string)$request->input('territory'))) : 'all';

        $data = $formService->index($search, $territory);

        return Inertia::render('Forms/Index', array_merge($data, [
            'filters' => [
                'search' => $search,
                'territory' => $territory
            ]
        ]));
    }

    public function create(FormRequest $r)
    {
        $data = $r->validated();
        $currentVersionId = Version::query()->where('isCurrent', true)->firstOrFail()->id;

        $form = Form::create([
            'name'       => $data['name'],
            'indicators' => $data['indicators'],
            'reports'    => $data['reports'],
            'coeff'      => $data['coeff'],
            'version_id' => $currentVersionId,
        ]);


        $form->departments()->sync($data['department_id']);
        // $form->versions()->attach($currentVersionId);

        return redirect()->back();
    }

    public function update()
    {
        dd('потом сделаю');
    }
}
