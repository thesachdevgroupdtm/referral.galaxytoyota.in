<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\User;
use App\Models\Referral;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $stats = [
            'total_rewards' => 250000,
            'successful_referrals' => 1500,
            'customer_satisfaction' => 98,
            'active_users' => User::count(),
        ];

        $featured_cars = Car::where('is_active', true)->limit(6)->get();
        
        return view('welcome', compact('stats', 'featured_cars'));
    }
}
