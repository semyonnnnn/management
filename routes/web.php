<?php

use Illuminate\Support\Facades\Route;
////////////////////////////////////////
use App\Http\Controllers\OldDepartmentsController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\UploadFilesController;
use App\Http\Controllers\VersionsController;
use App\Http\Controllers\OldFormsController;
use App\Http\Controllers\FormsDistributionController;
use App\Http\Controllers\FormsController;
use App\Http\Controllers\StatePageController;

Route::get('/', function () {
    return redirect('/old_main');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/main', [DepartmentsController::class, 'index'])->name('main.index');

    Route::get('/old_main', [OldDepartmentsController::class, 'index'])->name('old_main.index');

    Route::get('/uploadFiles', [UploadFilesController::class, 'index'])->name('uploadFiles.get');
    Route::post('/uploadFiles', [UploadFilesController::class, 'store'])->name('uploadFiles.upload');
    Route::put('/uploadFiles', [UploadFilesController::class, 'update'])->name('uploadFiles.update');

    Route::get('/versions', [VersionsController::class, 'index'])->name('versions.get');
    Route::post('/versions', [VersionsController::class, 'create'])->name('versions.create');
    Route::put('/versions/{id}', [VersionsController::class, 'update'])->name('versions.update');
    Route::delete('/versions/{id}', [VersionsController::class, 'delete'])->name('versions.delete');

    // Route::get('/old_forms', [OldFormsController::class, 'index'])->name('old_forms');

    Route::get('/forms', [FormsController::class, 'index'])->name('forms.index');
    Route::post('/forms', [FormsController::class, 'create'])->name('forms.create');
    Route::put('/forms', [FormsController::class, 'update'])->name('forms.update');
    Route::delete('/forms', [FormsController::class, 'delete'])->name('forms.delete');


    Route::get('/forms_distribution', [FormsDistributionController::class, 'index'])->name('forms_distribution.index');
    Route::post('/forms_distribution', [FormsDistributionController::class, 'create'])->name('forms_distribution.create');
    Route::put('/forms_distribution', [FormsDistributionController::class, 'update'])->name('forms_distribution.update');
    Route::delete('/forms_distribution', [FormsDistributionController::class, 'delete'])->name('forms_distribution.delete');

    Route::get('/state', [StatePageController::class, 'index'])->name('state.index');
    Route::post('/state', [StatePageController::class, 'create'])->name('state.create');
    Route::put('/state', [StatePageController::class, 'update'])->name('state.update');
    Route::delete('/state/{id}', [StatePageController::class, 'delete'])->name('state.delete');
});

require __DIR__ . '/auth.php';
