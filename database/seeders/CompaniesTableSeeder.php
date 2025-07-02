<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;
use Hash;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $adminCompany = [
                'name'      => 'Admin',
                'email'     => 'company@admin.com', 
        ];

        $company_id = Company::insertGetId($adminCompany);
        User::create([
            'name'          => 'Admin',
            'first_name'    => 'Menue',
            'last_name'     => 'Admin',
            'username'      => 'administrator',
            'email'         => 'admin@menue.com',
            'password'      => Hash::make('test123'),
            'role'          => 'admin',
            'company_id'    => $company_id
        ]);
    }
}
