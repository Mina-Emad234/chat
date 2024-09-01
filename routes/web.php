<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});




Auth::routes();

Route::group(['middleware'=>'auth:web'],function () {
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
    Route::resource('/messages', App\Http\Controllers\MessageController::class);
    Route::get('/private/{id}', [App\Http\Controllers\MessageController::class, 'private'])->name('private');
    Route::post('/private/store/{id}', [App\Http\Controllers\MessageController::class, 'privateStore'])->name('store.private');

});
