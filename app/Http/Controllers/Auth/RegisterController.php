<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Referral;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    use RegistersUsers;

    protected $redirectTo = '/dashboard';

    public function __construct()
    {
        $this->middleware('guest');
    }

    public function showRegistrationForm(Request $request)
    {
        $referral_code = $request->get('ref');
        return view('auth.register', compact('referral_code'));
    }

    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:15'],
        ]);
    }

    protected function create(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
        ]);

        // Handle referral
        if (!empty($data['referral_code'])) {
            $referrer = User::where('referral_code', $data['referral_code'])->first();
            if ($referrer) {
                $user->update(['referred_by' => $referrer->id]);
                
                // Create referral record
                Referral::create([
                    'referrer_id' => $referrer->id,
                    'referee_id' => $user->id,
                    'status' => 'pending',
                ]);
            }
        }

        return $user;
    }
}
