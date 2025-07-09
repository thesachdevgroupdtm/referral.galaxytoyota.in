@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8 fade-in-up">
        <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{ auth()->user()->name }}!</h1>
        <p class="text-gray-600">Track your referrals and earnings</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition fade-in-up" style="animation-delay: 0.1s;">
            <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="fas fa-users text-blue-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Referrals</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['total_referrals'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition fade-in-up" style="animation-delay: 0.2s;">
            <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                    <i class="fas fa-check-circle text-green-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Successful</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['successful_referrals'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition fade-in-up" style="animation-delay: 0.3s;">
            <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                    <i class="fas fa-clock text-yellow-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Pending</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['pending_referrals'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition fade-in-up" style="animation-delay: 0.4s;">
            <div class="flex items-center">
                <div class="p-2 bg-red-100 rounded-lg">
                    <i class="fas fa-rupee-sign text-red-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['total_earnings'] }}">0</p>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Referral Link -->
        <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow p-6 mb-8 fade-in-up" style="animation-delay: 0.5s;">
                <h2 class="text-xl font-bold mb-4">Your Referral Link</h2>
                <div class="flex items-center space-x-4">
                    <input type="text" 
                           id="referral-link"
                           value="{{ url('/register?ref=' . auth()->user()->referral_code) }}" 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                           readonly>
                    <button onclick="copyToClipboard()" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition transform hover:scale-105">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <p class="text-sm text-gray-600 mt-2">Share this link with friends to earn rewards!</p>
                
                <!-- Social Share Buttons -->
                <div class="mt-4 flex space-x-2">
                    <button onclick="shareWhatsApp()" class="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 transition">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button onclick="shareEmail()" class="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition">
                        <i class="fas fa-envelope"></i> Email
                    </button>
                    <button onclick="shareFacebook()" class="bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-800 transition">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                </div>
            </div>

            <!-- Recent Referrals -->
            <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.6s;">
                <h2 class="text-xl font-bold mb-4">Recent Referrals</h2>
                @if($referrals->count() > 0)
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Friend</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @foreach($referrals as $referral)
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ $referral->referee->name }}</div>
                                        <div class="text-sm text-gray-500">{{ $referral->referee->email }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            @if($referral->status === 'completed') bg-green-100 text-green-800
                                            @elseif($referral->status === 'pending') bg-yellow-100 text-yellow-800
                                            @else bg-red-100 text-red-800 @endif">
                                            {{ ucfirst($referral->status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        @if($referral->status === 'completed')
                                            ₹{{ number_format($referral->reward_amount, 0) }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ $referral->created_at->format('M d, Y') }}
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <div class="text-center py-8">
                        <i class="fas fa-users text-gray-300 text-4xl mb-4"></i>
                        <p class="text-gray-500">No referrals yet. Start sharing your link!</p>
                    </div>
                @endif
            </div>
        </div>

        <!-- Notifications -->
        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.7s;">
            <h2 class="text-xl font-bold mb-4">Recent Notifications</h2>
            @if($notifications->count() > 0)
                <div class="space-y-4">
                    @foreach($notifications as $notification)
                    <div class="border-l-4 border-red-500 pl-4 py-2 hover:bg-gray-50 transition">
                        <h3 class="font-semibold text-sm">{{ $notification->title }}</h3>
                        <p class="text-sm text-gray-600">{{ $notification->message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ $notification->created_at->diffForHumans() }}</p>
                    </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8">
                    <i class="fas fa-bell text-gray-300 text-4xl mb-4"></i>
                    <p class="text-gray-500">No notifications yet.</p>
                </div>
            @endif
        </div>
    </div>
</div>

<script>
function copyToClipboard() {
    const input = document.getElementById('referral-link');
    input.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = event.target.closest('button');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.classList.add('bg-green-600');
    button.classList.remove('bg-red-600');
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('bg-green-600');
        button.classList.add('bg-red-600');
    }, 2000);
}

function shareWhatsApp() {
    const link = document.getElementById('referral-link').value;
    const message = `Join Galaxy Toyota's referral program and earn amazing rewards! Use my referral link: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

function shareEmail() {
    const link = document.getElementById('referral-link').value;
    const subject = 'Join Galaxy Toyota Referral Program';
    const body = `Hi!\n\nI'd like to invite you to join Galaxy Toyota's referral program. You can earn amazing rewards when you purchase a Toyota vehicle.\n\nUse my referral link: ${link}\n\nBest regards!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

function shareFacebook() {
    const link = document.getElementById('referral-link').value;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 10000) {
            element.textContent = '₹' + Math.floor(current).toLocaleString();
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all counter elements
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });
});
</script>
@endsection
