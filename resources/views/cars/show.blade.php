@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Car Images -->
        <div class="fade-in-up">
            @if($car->images && count($car->images) > 0)
                <div class="mb-4">
                    <img src="{{ $car->images[0] }}" alt="{{ $car->name }}" class="w-full h-96 object-cover rounded-lg shadow-lg">
                </div>
                @if(count($car->images) > 1)
                    <div class="grid grid-cols-4 gap-2">
                        @foreach(array_slice($car->images, 1, 4) as $image)
                            <img src="{{ $image }}" alt="{{ $car->name }}" class="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition">
                        @endforeach
                    </div>
                @endif
            @else
                <div class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i class="fas fa-car text-gray-400 text-6xl"></i>
                </div>
            @endif
        </div>

        <!-- Car Details -->
        <div class="fade-in-up" style="animation-delay: 0.2s;">
            <div class="mb-4">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $car->name }}</h1>
                <div class="flex items-center space-x-4 text-sm text-gray-600">
                    <span class="bg-red-100 text-red-800 px-2 py-1 rounded">{{ $car->brand }}</span>
                    <span>{{ $car->year }}</span>
                    <span>{{ $car->model }}</span>
                </div>
            </div>

            <div class="mb-6">
                <span class="text-4xl font-bold text-red-600">{{ $car->formatted_price }}</span>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-2">Description</h3>
                <p class="text-gray-600">{{ $car->description }}</p>
            </div>

            <!-- Specifications -->
            @if($car->specifications)
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Specifications</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @foreach($car->specifications as $key => $value)
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span class="font-medium text-gray-700">{{ ucfirst(str_replace('_', ' ', $key)) }}</span>
                        <span class="text-gray-600">{{ $value }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Key Features -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Key Features</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center">
                        <i class="fas fa-gas-pump text-red-600 mr-3"></i>
                        <span>{{ $car->fuel_type }}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-cogs text-red-600 mr-3"></i>
                        <span>{{ $car->transmission }}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-calendar text-red-600 mr-3"></i>
                        <span>{{ $car->year }} Model</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-shield-alt text-red-600 mr-3"></i>
                        <span>Toyota Warranty</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4">
                @auth
                    <button class="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105">
                        <i class="fas fa-phone mr-2"></i>
                        Contact for Test Drive
                    </button>
                    <button onclick="shareThisCar()" class="w-full border border-red-600 text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition">
                        <i class="fas fa-share mr-2"></i>
                        Share with Friends
                    </button>
                @else
                    <a href="{{ route('register') }}" class="block w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105 text-center">
                        <i class="fas fa-user-plus mr-2"></i>
                        Join to Get Special Offers
                    </a>
                @endauth
            </div>
        </div>
    </div>

    <!-- Related Cars -->
    <div class="mt-16 fade-in-up" style="animation-delay: 0.4s;">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @php
                $relatedCars = \App\Models\Car::where('id', '!=', $car->id)
                    ->where('brand', $car->brand)
                    ->active()
                    ->take(3)
                    ->get();
            @endphp
            
            @foreach($relatedCars as $relatedCar)
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
                @if($relatedCar->images && count($relatedCar->images) > 0)
                    <img src="{{ $relatedCar->images[0] }}" alt="{{ $relatedCar->name }}" class="w-full h-48 object-cover">
                @else
                    <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-car text-gray-400 text-4xl"></i>
                    </div>
                @endif
                <div class="p-4">
                    <h3 class="font-bold mb-2">{{ $relatedCar->name }}</h3>
                    <p class="text-red-600 font-bold">{{ $relatedCar->formatted_price }}</p>
                    <a href="{{ route('cars.show', $relatedCar) }}" class="mt-2 inline-block text-red-600 hover:text-red-700">
                        View Details →
                    </a>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</div>

<script>
function shareThisCar() {
    const url = window.location.href;
    const title = '{{ $car->name }} - {{ $car->formatted_price }}';
    const text = 'Check out this amazing {{ $car->name }} at Galaxy Toyota!';
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(url).then(() => {
            alert('Car link copied to clipboard!');
        });
    }
}
</script>
@endsection
