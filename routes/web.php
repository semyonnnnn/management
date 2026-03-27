<?php

use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\VersionsController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect('/main');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/main', [DepartmentsController::class, 'index'])->name('main.index');

    Route::get('/uploadFiles', [UploadController::class, 'index'])->name('uploadFiles.get');
    Route::post('/uploadFiles', [UploadController::class, 'store'])->name('uploadFiles.post');

    Route::get('/versions', [VersionsController::class, 'index'])->name('versions.get');
    Route::post('/versions/{id}', [VersionsController::class, 'apply'])->name('versions.apply');
    Route::delete('/versions/{id}', [VersionsController::class, 'destroy'])->name('versions.delete');

});

require __DIR__ . '/auth.php';
