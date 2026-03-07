<?php

namespace Database\Seeders;

use App\Models\Licence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Language;
use App\Models\Currency;
use App\Models\Country;
use App\Models\User;
use Hash;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = new User([
            'name'          => 'Admin',
            'first_name'    => 'Menue',
            'last_name'     => 'Admin',
            'username'      => 'administrator',
            'email'         => 'admin@menue.com',
            'password'      => Hash::make('test1234'),
            'role'          => 'admin',
            // because he isn't part of any company,
            // he's just admin
            'company_id'    => null
        ]);
        $superadmin->save();

        $demoBasicUser = new User([
            'name'          => 'Demo',
            'first_name'    => 'Demo',
            'last_name'     => 'User',
            'username'      => 'demo',
            'email'         => 'demo_basic@menue.com',
            'password'      => Hash::make('test1234'),
            'role'          => 'demo',
            // because he isn't part of any company,
            // he's just admin
            'company_id'    => null
        ]);
        $demoBasicUser->save();
        $demoPremiumUser = new User([
            'name'          => 'Demo',
            'first_name'    => 'Demo',
            'last_name'     => 'Premium',
            'username'      => 'demo_premium',
            'email'         => 'demo_premium@menue.com',
            'password'      => Hash::make('test1234'),
            'role'          => 'demo',
            // because he isn't part of any company,
            // he's just admin
            'company_id'    => null
        ]);
        $demoPremiumUser->save();
        $demoEnterpriseUser = new User([
            'name'          => 'Demo',
            'first_name'    => 'Demo',
            'last_name'     => 'Enterprise',
            'username'      => 'demo_enterprise',
            'email'         => 'demo_enterprise@menue.com',
            'password'      => Hash::make('test1234'),
            'role'          => 'demo',
            // because he isn't part of any company,
            // he's just admin
            'company_id'    => null
        ]);
        $demoEnterpriseUser->save();

        $currency = null;
        $language = null;
        $country  = null;

        $defaultCurrency = Currency::where('code', 'eur')->first();
        if($defaultCurrency)
            $currency = $defaultCurrency->id;

        $defaultLanguage = Language::where('code', 'eng')->first();
        if($defaultLanguage)
            $language = $defaultLanguage->id;

        $defaultCountry = Country::where('common_name', 'United States')->first();
        if($defaultCountry)
            $country = $defaultCountry->id;

        $superadmin_licence = Licence::where(['type' => 'superadmin'])->first();
        $basic_licence = Licence::where('type', 'basic')->first();
        $premium_licence = Licence::where('type', 'premium')->first();
        $enterprise_licence = Licence::where('type', 'enterprise')->first();
        
        $adminCompany = [
                'name'      => 'SuperAdmin company',
                'email'     => 'admin@menue.com', 
                'currency_id'   => $currency,
                'language_id'   => $language,
                'country_id'    => $country,
                'licence_id'    => $superadmin_licence->id,
                // creator_id is id of agent who makes company
                'creator_id'    => $superadmin->id
        ];
        Company::insert($adminCompany);

        // we don't need demo licence there, we're just use demo company
        
        $basicLicenceCompany = [
                'name'      => 'Basic',
                'email'     => 'basic@menue.com', 
                'currency_id'   => $currency,
                'language_id'   => $language,
                'country_id'    => $country,
                'licence_id'    => $basic_licence->id,
                // creator_id is id of agent who makes company
                'creator_id'    => $demoBasicUser->id   
        ];
        Company::insert($basicLicenceCompany);

        $premiumLicenceCompany = [
                'name'      => 'Premium',
                'email'     => 'premium@menue.com', 
                'currency_id'   => $currency,
                'language_id'   => $language,
                'country_id'    => $country,
                'licence_id'    => $basic_licence->id,
                // creator_id is id of agent who makes company
                'creator_id'    => $demoPremiumUser->id  
        ];
        Company::insert($premiumLicenceCompany);

        $enterpriseLicenceCompany = [
                'name'      => 'Enterprise',
                'email'     => 'enterprise@menue.com', 
                'currency_id'   => $currency,
                'language_id'   => $language,
                'country_id'    => $country,
                'licence_id'    => $basic_licence->id,
                // creator_id is id of agent who makes company
                'creator_id'    => $demoEnterpriseUser->id  
        ];
        Company::insert($enterpriseLicenceCompany);
    }
}
