<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\User;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function index()
    {
        $user = Auth::user();
        
        // Generate referral code if not exists
        if (!$user->referral_code) {
            $user->referral_code = 'REF-' . strtoupper(Str::random(8));
            $user->save();
        }
        
        // Get user statistics
        $totalReferrals = Referral::where('referrer_id', $user->id)->count();
        $successfulReferrals = Referral::where('referrer_id', $user->id)
            ->where('status', 'completed')->count();
        $pendingReferrals = Referral::where('referrer_id', $user->id)
            ->where('status', 'pending')->count();
        $totalRewards = $user->reward_points ?? 0;
        
        // Recent referrals
        $recentReferrals = Referral::where('referrer_id', $user->id)
            ->with('referee')
            ->latest()
            ->take(5)
            ->get();
        
        return view('dashboard', compact(
            'user',
            'totalReferrals',
            'successfulReferrals',
            'pendingReferrals',
            'totalRewards',
            'recentReferrals'
        ));
    }
    
    public function createReferral(Request $request)
    {
        $request->validate([
            'referee_email' => 'required|email|unique:users,email',
            'referee_name' => 'required|string|max:255',
            'referee_phone' => 'nullable|string|max:20',
        ]);
        
        $referral = Referral::create([
            'referrer_id' => Auth::id(),
            'referee_email' => $request->referee_email,
            'referee_name' => $request->referee_name,
            'referee_phone' => $request->referee_phone,
            'status' => 'pending',
            'referral_code' => Auth::user()->referral_code,
        ]);
        
        // Here you would typically send an email invitation
        // Mail::to($request->referee_email)->send(new ReferralInvitation($referral));
        
        return redirect()->back()->with('success', 'Referral invitation sent successfully!');
    }
    
    // API method for dashboard stats
    public function apiStats()
    {
        $user = Auth::user();
        
        return response()->json([
            'total_referrals' => Referral::where('referrer_id', $user->id)->count(),
            'successful_referrals' => Referral::where('referrer_id', $user->id)
                ->where('status', 'completed')->count(),
            'pending_referrals' => Referral::where('referrer_id', $user->id)
                ->where('status', 'pending')->count(),
            'total_rewards' => $user->reward_points ?? 0,
        ]);
    }
    
    public function apiCreateReferral(Request $request)
    {
        $request->validate([
            'referee_email' => 'required|email|unique:users,email',
            'referee_name' => 'required|string|max:255',
            'referee_phone' => 'nullable|string|max:20',
        ]);
        
        $referral = Referral::create([
            'referrer_id' => Auth::id(),
            'referee_email' => $request->referee_email,
            'referee_name' => $request->referee_name,
            'referee_phone' => $request->referee_phone,
            'status' => 'pending',
            'referral_code' => Auth::user()->referral_code,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Referral invitation sent successfully!',
            'referral' => $referral
        ]);
    }
}
