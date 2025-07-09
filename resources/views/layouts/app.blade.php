<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Galaxy Toyota') }}</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    
    <!-- Scripts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Animation Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js"></script>
    
    <style>
        .typing-cursor {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .fade-in-up.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .scale-in {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.5s ease;
        }
        
        .scale-in.animate {
            opacity: 1;
            transform: scale(1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="{{ url('/') }}" class="flex items-center space-x-2">
                        <i class="fas fa-car text-red-600 text-xl"></i>
                        <span class="text-xl font-bold">Galaxy Toyota</span>
                    </a>
                </div>
                
                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="{{ url('/') }}" class="text-gray-700 hover:text-red-600 transition">Home</a>
                    <a href="{{ route('cars.index') }}" class="text-gray-700 hover:text-red-600 transition">Cars</a>
                    @auth
                        <a href="{{ route('dashboard') }}" class="text-gray-700 hover:text-red-600 transition">Dashboard</a>
                        @if(auth()->user()->isAdmin())
                            <a href="{{ route('admin.dashboard') }}" class="text-gray-700 hover:text-red-600 transition">Admin</a>
                        @endif
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="text-gray-700 hover:text-red-600 transition">Logout</button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="text-gray-700 hover:text-red-600 transition">Login</a>
                        <a href="{{ route('register') }}" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Sign Up</a>
                    @endauth
                </div>
                
                <!-- Mobile Menu Button -->
                <div class="md:hidden flex items-center">
                    <button id="mobile-menu-button" class="text-gray-700 hover:text-red-600">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div id="mobile-menu" class="md:hidden hidden pb-4">
                <a href="{{ url('/') }}" class="block py-2 text-gray-700 hover:text-red-600">Home</a>
                <a href="{{ route('cars.index') }}" class="block py-2 text-gray-700 hover:text-red-600">Cars</a>
                @auth
                    <a href="{{ route('dashboard') }}" class="block py-2 text-gray-700 hover:text-red-600">Dashboard</a>
                    @if(auth()->user()->isAdmin())
                        <a href="{{ route('admin.dashboard') }}" class="block py-2 text-gray-700 hover:text-red-600">Admin</a>
                    @endif
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="block py-2 text-gray-700 hover:text-red-600">Logout</button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="block py-2 text-gray-700 hover:text-red-600">Login</a>
                    <a href="{{ route('register') }}" class="block py-2 bg-red-600 text-white px-4 rounded hover:bg-red-700 mt-2">Sign Up</a>
                @endauth
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main>
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-4" role="alert">
                <span class="block sm:inline">{{ session('success') }}</span>
            </div>
        @endif
        
        @if(session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4" role="alert">
                <span class="block sm:inline">{{ session('error') }}</span>
            </div>
        @endif
        
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="flex items-center space-x-2 mb-4 md:mb-0">
                    <i class="fas fa-car text-red-600 text-xl"></i>
                    <span class="text-xl font-bold">Galaxy Toyota</span>
                </div>
                <div class="flex space-x-6">
                    <a href="#" class="hover:text-red-400 transition">Privacy Policy</a>
                    <a href="#" class="hover:text-red-400 transition">Terms of Service</a>
                    <a href="#" class="hover:text-red-400 transition">Contact Us</a>
                </div>
            </div>
            <div class="text-center mt-4 text-gray-400">
                <p>&copy; {{ date('Y') }} Galaxy Toyota. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.addEventListener('DOMContentLoaded', function() {
            const animatedElements = document.querySelectorAll('.fade-in-up, .scale-in');
            animatedElements.forEach(el => observer.observe(el));
        });
    </script>
</body>
</html>
