<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Car;
use App\Models\Referral;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@galaxytoyota.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create sample users
        $users = [];
        for ($i = 1; $i <= 10; $i++) {
            $users[] = User::create([
                'name' => "User $i",
                'email' => "user$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'referrer',
                'email_verified_at' => now(),
                'points' => rand(0, 5000),
            ]);
        }

        // Create sample cars
        $cars = [
            [
                'name' => 'Toyota Camry',
                'brand' => 'Toyota',
                'model' => 'Camry',
                'price' => 4200000,
                'description' => 'The Toyota Camry is a premium sedan that combines luxury, performance, and reliability. Perfect for executives and families who demand the best.',
                'specifications' => [
                    'engine' => '2.5L 4-Cylinder',
                    'power' => '203 HP',
                    'mileage' => '15 kmpl',
                    'seating' => '5 Seater',
                    'safety' => '5 Star Rating'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop'
                ],
                'fuel_type' => 'Petrol',
                'transmission' => 'Automatic',
                'year' => 2024,
            ],
            [
                'name' => 'Toyota Fortuner',
                'brand' => 'Toyota',
                'model' => 'Fortuner',
                'price' => 3500000,
                'description' => 'The Toyota Fortuner is a robust SUV perfect for both city driving and off-road adventures. Built for the Indian roads.',
                'specifications' => [
                    'engine' => '2.8L Diesel',
                    'power' => '201 HP',
                    'mileage' => '12 kmpl',
                    'seating' => '7 Seater',
                    'drive' => '4WD Available'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop'
                ],
                'fuel_type' => 'Diesel',
                'transmission' => 'Automatic',
                'year' => 2024,
            ],
            [
                'name' => 'Toyota Innova Crysta',
                'brand' => 'Toyota',
                'model' => 'Innova Crysta',
                'price' => 1900000,
                'description' => 'The Toyota Innova Crysta is a versatile MPV that offers comfort and space for families. The perfect family companion.',
                'specifications' => [
                    'engine' => '2.4L Diesel',
                    'power' => '148 HP',
                    'mileage' => '14 kmpl',
                    'seating' => '8 Seater',
                    'comfort' => 'Premium Interior'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
                ],
                'fuel_type' => 'Diesel',
                'transmission' => 'Manual',
                'year' => 2024,
            ],
            [
                'name' => 'Toyota Glanza',
                'brand' => 'Toyota',
                'model' => 'Glanza',
                'price' => 750000,
                'description' => 'The Toyota Glanza is a stylish and efficient hatchback perfect for city commuting. Compact yet spacious.',
                'specifications' => [
                    'engine' => '1.2L Petrol',
                    'power' => '89 HP',
                    'mileage' => '22 kmpl',
                    'seating' => '5 Seater',
                    'features' => 'Smart Connectivity'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop'
                ],
                'fuel_type' => 'Petrol',
                'transmission' => 'Manual',
                'year' => 2024,
            ],
            [
                'name' => 'Toyota Urban Cruiser',
                'brand' => 'Toyota',
                'model' => 'Urban Cruiser',
                'price' => 1200000,
                'description' => 'The Toyota Urban Cruiser is a compact SUV designed for urban adventures. Perfect blend of style and functionality.',
                'specifications' => [
                    'engine' => '1.5L Petrol',
                    'power' => '105 HP',
                    'mileage' => '17 kmpl',
                    'seating' => '5 Seater',
                    'ground_clearance' => '200mm'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
                ],
                'fuel_type' => 'Petrol',
                'transmission' => 'Manual',
                'year' => 2024,
            ],
            [
                'name' => 'Toyota Vellfire',
                'brand' => 'Toyota',
                'model' => 'Vellfire',
                'price' => 9200000,
                'description' => 'The Toyota Vellfire is a luxury MPV that redefines premium travel. Ultimate comfort and sophistication.',
                'specifications' => [
                    'engine' => '2.5L Hybrid',
                    'power' => '180 HP',
                    'mileage' => '16 kmpl',
                    'seating' => '7 Seater',
                    'luxury' => 'Premium Lounge Seats'
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop'
                ],
                'fuel_type' => 'Hybrid',
                'transmission' => 'Automatic',
                'year' => 2024,
            ],
        ];

        foreach ($cars as $car) {
            Car::create($car);
        }

        // Create sample referrals
        for ($i = 0; $i < 15; $i++) {
            $referrer = $users[array_rand($users)];
            $referee = $users[array_rand($users)];
            
            if ($referrer->id !== $referee->id) {
                $status = ['pending', 'completed', 'cancelled'][rand(0, 2)];
                
                $referral = Referral::create([
                    'referrer_id' => $referrer->id,
                    'referee_id' => $referee->id,
                    'status' => $status,
                    'reward_amount' => $status === 'completed' ? 10000 : 0,
                    'points_earned' => $status === 'completed' ? 1000 : 0,
                    'completed_at' => $status === 'completed' ? now()->subDays(rand(1, 30)) : null,
                ]);
                
                if ($status === 'completed') {
                    $referrer->increment('points', 1000);
                }
            }
        }
    }
}
