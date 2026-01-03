<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $modulesPath = app_path('Modules');

        if (File::exists($modulesPath)) {
            $modules = File::directories($modulesPath);

            foreach ($modules as $module) {
                $moduleName = basename($module);

                // Load Routes
                if (File::exists($module . '/Routes/web.php')) {
                    Route::middleware('web')
                        ->group($module . '/Routes/web.php');
                }

                // Load Views
                if (File::exists($module . '/Views')) {
                    $this->loadViewsFrom($module . '/Views', strtolower($moduleName));
                }
            }
        }
    }
}
