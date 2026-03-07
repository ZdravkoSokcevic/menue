<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Licence;

class LicencesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $licences = [
            // One and only superadmin company
            [
                'name' => 'Superadmin',
                'quantity' => 0,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'superadmin'
            ],
            [
                'name' => 'Basic',
                'quantity' => 200,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'basic'
            ], [
                'name' => 'Premium',
                'quantity' => 200,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'premium'
            ], [
                'name' => 'Enterprise',
                'quantity' => 200,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'enterprise'
            ], [
                'name' => 'Demo basic',
                'quantity' => 200,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'demo'
            ], [
                'name' => 'Demo premium',
                'quantity' => 200,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'demo_premium'
            ], [
                'name' => 'Demo enterprise',
                'quantity' => 200,
                'description' => '',
                'picture' => '',
                'discount' => 0,
                'discount_type' => '',
                'type' => 'demo_enterprise'
            ]
        ];

        Licence::insert($licences);
    }
}
