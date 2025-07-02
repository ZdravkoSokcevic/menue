<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\CompanyRepositoryInterface;
use App\Http\Repositories\CompanyRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
         $this->app->bind(CompanyRepositoryInterface::class, CompanyRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
