<?php

use Illuminate\Support\Facades\Route;
////////////////////////////////////////
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\VersionsController;
use App\Http\Controllers\OldFormsController;
use App\Http\Controllers\StatePageController;

Route::get('/', function () {
    return redirect('/main');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/main', [DepartmentsController::class, 'index'])->name('main.index');

    Route::get('/uploadFiles', [UploadController::class, 'index'])->name('uploadFiles.get');
    Route::post('/uploadFiles', [UploadController::class, 'store'])->name('uploadFiles.upload');
    Route::put('/uploadFiles', [UploadController::class, 'update'])->name('uploadFiles.update');

    Route::get('/versions', [VersionsController::class, 'index'])->name('versions.get');
    Route::post('/versions/{id}', [VersionsController::class, 'apply'])->name('versions.apply');
    Route::post('/versions', [VersionsController::class, 'create'])->name('versions.create');
    Route::delete('/versions/{id}', [VersionsController::class, 'destroy'])->name('versions.delete');

    Route::get('/old_forms', [OldFormsController::class, 'index'])->name('old_forms');

    Route::get('/state', [StatePageController::class, 'index'])->name('state.index');
    Route::post('/state', [StatePageController::class, 'create'])->name('state.create');
    Route::put('/state', [StatePageController::class, 'update'])->name('state.update');
    Route::delete('/state/{id}', [StatePageController::class, 'destroy'])->name('state.delete');
});

require __DIR__ . '/auth.php';
