<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return redirect('/main');
});



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/main', [DashboardController::class, 'index'])->name('main.index');
});

require __DIR__ . '/auth.php';
