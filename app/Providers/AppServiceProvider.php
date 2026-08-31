<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // TODO: Overview every of gate separately
        Gate::define('view-table', function($user,Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id') && $user->company_id == $r->input('company_id'))
                return true;
            else if($user->isAgent() || $user->isDemo())
                return true;

            return false;
        });

        Gate::define('view-menu', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        Gate::define('view-categories', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        Gate::define('view-companies', function(User $user, Request $r) {
                return true;
        });

        // VIEW ORDERS GATE
        Gate::define('view-orders', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        // VIEW TABLES GATE
        Gate::define('view-allergens', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        // VIEW INGRIDIENTS GATE
        Gate::define('view-ingrFidients', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        // VIEW EXTRAS GATE
        Gate::define('view-extras', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        // VIEW PREFERENCES GATE
        Gate::define('view-preferences', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });



        Gate::define('view-discounts', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });

        Gate::define('view-combos', function(User $user, Request $r) {
            if($user->isAdminOrDemo())
                return true;
            else if($r->filled('company_id'))
                return true;

            return false;  
        });


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
