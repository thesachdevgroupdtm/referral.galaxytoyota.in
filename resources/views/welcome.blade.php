<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galaxy Toyota - Car Referral Program</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script>
    <style>
        :root {
            --primary-color: #e60012;
            --secondary-color: #333;
            --accent-color: #f8f9fa;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
        }

        .hero-section {
            background: linear-gradient(135deg, var(--primary-color), #c8000f);
            color: white;
            padding: 100px 0;
            position: relative;
            overflow: hidden;
        }

        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="0,0 1000,0 1000,100"/></svg>');
            background-size: cover;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .typed-text {
            font-size: 3.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            min-height: 120px;
        }

        .stats-section {
            padding: 80px 0;
            background: var(--accent-color);
        }

        .stat-card {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-10px);
        }

        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .features-section {
            padding: 80px 0;
        }

        .feature-card {
            text-align: center;
            padding: 2rem;
            border-radius: 15px;
            transition: all 0.3s ease;
            margin-bottom: 2rem;
        }

        .feature-card:hover {
            background: var(--accent-color);
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 3rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .cars-section {
            padding: 80px 0;
            background: var(--accent-color);
        }

        .car-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            margin-bottom: 2rem;
        }

        .car-card:hover {
            transform: translateY(-10px);
        }

        .car-image {
            height: 200px;
            background-size: cover;
            background-position: center;
        }

        .car-content {
            padding: 1.5rem;
        }

        .car-price {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            padding: 12px 30px;
            font-weight: 600;
            border-radius: 25px;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background-color: #c8000f;
            border-color: #c8000f;
            transform: translateY(-2px);
        }

        .navbar-brand {
            font-weight: bold;
            font-size: 1.5rem;
        }

        .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .fade-in-up.visible {
            opacity: 1;
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            .typed-text {
                font-size: 2.5rem;
                min-height: 80px;
            }
            
            .hero-section {
                padding: 60px 0;
            }
            
            .stats-section, .features-section, .cars-section {
                padding: 60px 0;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div class="container">
            <a class="navbar-brand text-danger" href="{{ route('home') }}">
                <i class="fas fa-car"></i> Galaxy Toyota
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('home') }}">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('cars.index') }}">Cars</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#how-it-works">How It Works</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    @guest
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('login') }}">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="btn btn-primary ms-2" href="{{ route('register') }}">Sign Up</a>
                        </li>
                    @else
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
                        </li>
                        @if(Auth::user()->isAdmin())
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('admin.dashboard') }}">Admin</a>
                            </li>
                        @endif
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('logout') }}" 
                               onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                Logout
                            </a>
                            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                @csrf
                            </form>
                        </li>
                    @endguest
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="hero-content">
                        <div class="typed-text" id="typed-text"></div>
                        <p class="lead mb-4">Join our exclusive car referral program and earn amazing rewards for every successful referral. Help your friends find their dream Toyota while earning cash rewards!</p>
                        <div class="d-flex gap-3 flex-wrap">
                            <a href="{{ route('register') }}" class="btn btn-light btn-lg">
                                <i class="fas fa-user-plus"></i> Join Now
                            </a>
                            <a href="{{ route('cars.index') }}" class="btn btn-outline-light btn-lg">
                                <i class="fas fa-car"></i> View Cars
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="text-center">
                        <i class="fas fa-handshake" style="font-size: 15rem; opacity: 0.3;"></i>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card fade-in-up">
                        <div class="stat-number" data-target="{{ $stats['total_rewards'] }}">0</div>
                        <h5>Total Rewards Earned</h5>
                        <p class="text-muted">₹ in rewards distributed</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card fade-in-up">
                        <div class="stat-number" data-target="{{ $stats['successful_referrals'] }}">0</div>
                        <h5>Successful Referrals</h5>
                        <p class="text-muted">Happy customers referred</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card fade-in-up">
                        <div class="stat-number" data-target="{{ $stats['customer_satisfaction'] }}">0</div>
                        <h5>Customer Satisfaction</h5>
                        <p class="text-muted">% satisfaction rate</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card fade-in-up">
                        <div class="stat-number" data-target="{{ $stats['active_users'] }}">0</div>
                        <h5>Active Users</h5>
                        <p class="text-muted">Members in our program</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-4 fw-bold fade-in-up">Why Choose Our Referral Program?</h2>
                    <p class="lead text-muted fade-in-up">Discover the benefits of joining our exclusive referral network</p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <h4>Earn Cash Rewards</h4>
                        <p>Get ₹10,000 for every successful referral. No limits on how much you can earn!</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>Help Friends & Family</h4>
                        <p>Share amazing Toyota deals with your loved ones and help them find their perfect car.</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <h4>Exclusive Benefits</h4>
                        <p>Access special discounts, priority service, and exclusive Toyota events.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Cars Section -->
    <section class="cars-section">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-4 fw-bold fade-in-up">Featured Toyota Cars</h2>
                    <p class="lead text-muted fade-in-up">Discover our latest collection of premium Toyota vehicles</p>
                </div>
            </div>
            <div class="row">
                @foreach($featured_cars as $car)
                <div class="col-lg-4 col-md-6">
                    <div class="car-card fade-in-up">
                        <div class="car-image" style="background-image: url('{{ $car->images[0] ?? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=200&fit=crop' }}');"></div>
                        <div class="car-content">
                            <h5 class="fw-bold">{{ $car->name }}</h5>
                            <p class="text-muted">{{ Str::limit($car->description, 100) }}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="car-price">{{ $car->formatted_price }}</div>
                                <a href="{{ route('cars.show', $car) }}" class="btn btn-primary">View Details</a>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
            <div class="text-center mt-4">
                <a href="{{ route('cars.index') }}" class="btn btn-primary btn-lg">
                    <i class="fas fa-car"></i> View All Cars
                </a>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="features-section">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center mb-5">
                    <h2 class="display-4 fw-bold fade-in-up">How It Works</h2>
                    <p class="lead text-muted fade-in-up">Simple steps to start earning rewards</p>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <h4>1. Sign Up</h4>
                        <p>Create your free account and get your unique referral code instantly.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-share"></i>
                        </div>
                        <h4>2. Share</h4>
                        <p>Share your referral code with friends, family, and social networks.</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-car"></i>
                        </div>
                        <h4>3. They Buy</h4>
                        <p>When someone purchases a Toyota using your code, you both win!</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="feature-card fade-in-up">
                        <div class="feature-icon">
                            <i class="fas fa-money-bill"></i>
                        </div>
                        <h4>4. Earn Rewards</h4>
                        <p>Receive your cash reward within 24 hours of successful purchase.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h2 class="display-4 fw-bold mb-4 fade-in-up">Ready to Start Earning?</h2>
                    <p class="lead mb-4 fade-in-up">Join thousands of satisfied members who are already earning rewards!</p>
                    <a href="{{ route('register') }}" class="btn btn-light btn-lg fade-in-up">
                        <i class="fas fa-rocket"></i> Get Started Now
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <h5><i class="fas fa-car"></i> Galaxy Toyota</h5>
                    <p>Your trusted partner for Toyota cars and referral rewards.</p>
                </div>
                <div class="col-lg-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="{{ route('home') }}" class="text-white-50">Home</a></li>
                        <li><a href="{{ route('cars.index') }}" class="text-white-50">Cars</a></li>
                        <li><a href="{{ route('login') }}" class="text-white-50">Login</a></li>
                        <li><a href="{{ route('register') }}" class="text-white-50">Sign Up</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h5>Contact Info</h5>
                    <p class="text-white-50">
                        <i class="fas fa-phone"></i> +91 9876543210<br>
                        <i class="fas fa-envelope"></i> info@galaxytoyota.com<br>
                        <i class="fas fa-map-marker-alt"></i> Mumbai, India
                    </p>
                </div>
            </div>
            <hr class="my-4">
            <div class="row">
                <div class="col-12 text-center">
                    <p class="mb-0">&copy; 2024 Galaxy Toyota. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Typing Animation
        document.addEventListener('DOMContentLoaded', function() {
            new Typed('#typed-text', {
                strings: [
                    'Refer Friends,<br>Earn Rewards',
                    'Share Toyota Cars,<br>Get Cash Back',
                    'Help Others,<br>Earn Money'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        });

        // Counter Animation
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    element.textContent = Math.floor(current) + '%';
                }
            }, 20);
        }

        // Fade in animation
        function fadeInUp() {
            const elements = document.querySelectorAll('.fade-in-up');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                    
                    // Animate counters when they become visible
                    const counter = element.querySelector('.stat-number[data-target]');
                    if (counter && !counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter);
                    }
                }
            });
        }

        // Initialize animations
        window.addEventListener('scroll', fadeInUp);
        window.addEventListener('load', fadeInUp);
        fadeInUp(); // Run once on page load
    </script>
</body>
</html>
