<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('cors')->group(function () {
    Route::post('/upload-image', 'ImageUploadController@upload');
});

