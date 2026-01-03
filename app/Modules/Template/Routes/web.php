<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Template\Controllers\TemplateController;

Route::middleware(['auth'])->group(function () {
    Route::resource('templates', TemplateController::class);
    
    Route::post('templates/preview', [TemplateController::class, 'preview'])->name('templates.preview');
    Route::post('templates/send-test', [TemplateController::class, 'sendTest'])->name('templates.send-test');
});
