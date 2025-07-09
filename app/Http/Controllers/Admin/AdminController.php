<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Referral;
use App\Models\Car;
use App\Models\Notification;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin']);
    }

    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_referrals' => Referral::count(),
            'completed_referrals' => Referral::where('status', 'completed')->count(),
            'total_cars' => Car::count(),
            'total_rewards_paid' => Referral::where('status', 'completed')->sum('reward_amount'),
        ];

        $recent_referrals = Referral::with(['referrer', 'referee'])->latest()->take(10)->get();
        $top_referrers = User::withCount('referrals')->orderBy('referrals_count', 'desc')->take(10)->get();

        return view('admin.dashboard', compact('stats', 'recent_referrals', 'top_referrers'));
    }

    public function users()
    {
        $users = User::with('referrals')->paginate(20);
        return view('admin.users', compact('users'));
    }

    public function referrals()
    {
        $referrals = Referral::with(['referrer', 'referee'])->latest()->paginate(20);
        return view('admin.referrals', compact('referrals'));
    }

    public function updateReferralStatus(Request $request, Referral $referral)
    {
        $request->validate([
            'status' => 'required|in:pending,completed,cancelled'
        ]);

        if ($request->status === 'completed' && $referral->status !== 'completed') {
            $referral->markAsCompleted();
            
            // Send notification to referrer
            Notification::create([
                'user_id' => $referral->referrer_id,
                'title' => 'Referral Completed!',
                'message' => 'Your referral has been completed. You earned ₹' . number_format($referral->reward_amount, 0) . '!',
                'type' => 'referral_update',
            ]);
        } else {
            $referral->update(['status' => $request->status]);
        }

        return back()->with('success', 'Referral status updated successfully!');
    }

    public function cars()
    {
        $cars = Car::latest()->paginate(20);
        return view('admin.cars', compact('cars'));
    }

    public function storeCar(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'fuel_type' => 'required|string',
            'transmission' => 'required|string',
            'year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
        ]);

        Car::create($request->all());

        return back()->with('success', 'Car added successfully!');
    }
}
