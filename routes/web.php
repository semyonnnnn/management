<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Document\DocumentController;
use App\Http\Controllers\File\FileController;
use App\Http\Controllers\UserController;

Route::get(
    '/',
    [MainController::class, 'index']
);



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/main', [DashboardController::class, 'index'])->name('main.index');
});

require __DIR__ . '/auth.php';
