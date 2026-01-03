<?php

use Illuminate\Support\Facades\Route;
use App\Modules\TripTemplate\Controllers\TripTemplateController;

Route::middleware(['auth'])->group(function () {
    Route::resource('trip-templates', TripTemplateController::class);
});
