<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Admin\Controllers\AdminController;

Route::middleware(['auth'])->group(function () {
    Route::resource('admins', AdminController::class)->except(['show']);
});
