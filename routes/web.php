<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

// Authentication Routes
Auth::routes();

// Car Routes
Route::get('/cars', [CarController::class, 'index'])->name('cars.index');
Route::get('/cars/{car}', [CarController::class, 'show'])->name('cars.show');

// User Dashboard
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/referral/create', [DashboardController::class, 'createReferral'])->name('referral.create');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/referrals', [AdminController::class, 'referrals'])->name('admin.referrals');
    Route::get('/cars', [AdminController::class, 'cars'])->name('admin.cars');
    Route::post('/cars', [AdminController::class, 'storeCar'])->name('admin.cars.store');
    Route::put('/cars/{car}', [AdminController::class, 'updateCar'])->name('admin.cars.update');
    Route::delete('/cars/{car}', [AdminController::class, 'destroyCar'])->name('admin.cars.destroy');
});

// API Routes
Route::prefix('api/v1')->group(function () {
    Route::get('/cars', [CarController::class, 'apiIndex']);
    Route::get('/cars/{car}', [CarController::class, 'apiShow']);
});
