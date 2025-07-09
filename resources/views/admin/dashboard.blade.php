@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8 fade-in-up">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600">Manage your referral program</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.1s;">
            <div class="flex items-center">
                <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="fas fa-users text-blue-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Users</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['total_users'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.2s;">
            <div class="flex items-center">
                <div class="p-2 bg-green-100 rounded-lg">
                    <i class="fas fa-handshake text-green-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Referrals</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['total_referrals'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.3s;">
            <div class="flex items-center">
                <div class="p-2 bg-yellow-100 rounded-lg">
                    <i class="fas fa-check-circle text-yellow-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Completed</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['completed_referrals'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.4s;">
            <div class="flex items-center">
                <div class="p-2 bg-purple-100 rounded-lg">
                    <i class="fas fa-car text-purple-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Cars</p>
                    <p class="text-2xl font-bold text-gray-900 counter" data-target="{{ $stats['total_cars'] }}">0</p>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.5s;">
            <div class="flex items-center">
                <div class="p-2 bg-red-100 rounded-lg">
                    <i class="fas fa-rupee-sign text-red-600"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Rewards Paid</p>
                    <p class="text-xl font-bold text-gray-900 counter" data-target="{{ $stats['total_rewards_paid'] }}">0</p>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Referrals -->
        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.6s;">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Recent Referrals</h2>
                <a href="{{ route('admin.referrals') }}" class="text-red-600 hover:text-red-700">View All</a>
            </div>
            
            @if($recent_referrals->count() > 0)
                <div class="space-y-4">
                    @foreach($recent_referrals as $referral)
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                            <p class="font-medium">{{ $referral->referrer->name }}</p>
                            <p class="text-sm text-gray-600">referred {{ $referral->referee->name }}</p>
                        </div>
                        <div class="text-right">
                            <span class="px-2 py-1 text-xs rounded-full 
                                @if($referral->status === 'completed') bg-green-100 text-green-800
                                @elseif($referral->status === 'pending') bg-yellow-100 text-yellow-800
                                @else bg-red-100 text-red-800 @endif">
                                {{ ucfirst($referral->status) }}
                            </span>
                            <p class="text-xs text-gray-500 mt-1">{{ $referral->created_at->diffForHumans() }}</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            @else
                <p class="text-gray-500 text-center py-8">No referrals yet.</p>
            @endif
        </div>

        <!-- Top Referrers -->
        <div class="bg-white rounded-lg shadow p-6 fade-in-up" style="animation-delay: 0.7s;">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Top Referrers</h2>
                <a href="{{ route('admin.users') }}" class="text-red-600 hover:text-red-700">View All</a>
            </div>
            
            @if($top_referrers->count() > 0)
                <div class="space-y-4">
                    @foreach($top_referrers as $index => $user)
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                {{ $index + 1 }}
                            </div>
                            <div>
                                <p class="font-medium">{{ $user->name }}</p>
                                <p class="text-sm text-gray-600">{{ $user->email }}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-red-600">{{ $user->referrals_count }}</p>
                            <p class="text-xs text-gray-500">referrals</p>
                        </div>
                    </div>
                    @endforeach
                </div>
            @else
                <p class="text-gray-500 text-center py-8">No users yet.</p>
            @endif
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 fade-in-up" style="animation-delay: 0.8s;">
        <a href="{{ route('admin.users') }}" class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition text-center">
            <i class="fas fa-users text-2xl mb-2"></i>
            <p class="font-semibold">Manage Users</p>
        </a>
        <a href="{{ route('admin.referrals') }}" class="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center">
            <i class="fas fa-handshake text-2xl mb-2"></i>
            <p class="font-semibold">Manage Referrals</p>
        </a>
        <a href="{{ route('admin.cars') }}" class="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition text-center">
            <i class="fas fa-car text-2xl mb-2"></i>
            <p class="font-semibold">Manage Cars</p>
        </a>
        <a href="#" class="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition text-center">
            <i class="fas fa-chart-bar text-2xl mb-2"></i>
            <p class="font-semibold">View Reports</p>
        </a>
    </div>
</div>

<script>
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
