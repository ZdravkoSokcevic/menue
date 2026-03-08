<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(LicencesTableSeeder::class);
        $this->call(CompaniesTableSeeder::class);
        $this->call(CategoriesSeeder::class);

        Artisan::call('app:countries-data-sync');

        echo Artisan::output();
    }
}
