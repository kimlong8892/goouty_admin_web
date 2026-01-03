<?php

use Illuminate\Support\Facades\Route;
use App\Modules\TripTemplate\Controllers\TripTemplateController;
use App\Modules\TripTemplate\Controllers\TripTemplateDayController;
use App\Modules\TripTemplate\Controllers\TripTemplateActivityController;

Route::middleware(['auth'])->group(function () {
    Route::resource('trip-templates', TripTemplateController::class);
    
    // Days
    Route::post('trip-templates/{template}/days', [TripTemplateDayController::class, 'store'])->name('trip-template-days.store');
    Route::put('trip-template-days/{day}', [TripTemplateDayController::class, 'update'])->name('trip-template-days.update');
    Route::delete('trip-template-days/{day}', [TripTemplateDayController::class, 'destroy'])->name('trip-template-days.destroy');

    // Activities
    Route::post('trip-template-days/{day}/activities', [TripTemplateActivityController::class, 'store'])->name('trip-template-activities.store');
    Route::put('trip-template-activities/{activity}', [TripTemplateActivityController::class, 'update'])->name('trip-template-activities.update');
    Route::delete('trip-template-activities/{activity}', [TripTemplateActivityController::class, 'destroy'])->name('trip-template-activities.destroy');
});
