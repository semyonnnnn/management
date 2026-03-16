<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect('/main');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/main', [DashboardController::class, 'index'])->name('main.index');
    Route::post('/uploadFiles', [DashboardController::class, 'uploadFiles'])->name('uploadFiles');
});

require __DIR__ . '/auth.php';
