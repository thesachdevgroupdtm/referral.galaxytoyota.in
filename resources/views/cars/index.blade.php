@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 fade-in-up">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Our Car Collection</h1>
        <p class="text-gray-600">Discover our range of Toyota vehicles</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-8 fade-in-up" style="animation-delay: 0.1s;">
        <form method="GET" action="{{ route('cars.index') }}" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select name="brand" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500">
                    <option value="">All Brands</option>
                    @foreach($brands as $brand)
                        <option value="{{ $brand }}" {{ request('brand') == $brand ? 'selected' : '' }}>{{ $brand }}</option>
                    @endforeach
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input type="number" name="min_price" value="{{ request('min_price') }}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" 
                       placeholder="Min Price">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input type="number" name="max_price" value="{{ request('max_price') }}" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500" 
                       placeholder="Max Price">
            </div>
            
            <div class="flex items-end">
                <button type="submit" class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                    <i class="fas fa-search mr-2"></i>Filter
                </button>
            </div>
        </form>
    </div>

    <!-- Cars Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @foreach($cars as $index => $car)
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105 fade-in-up" style="animation-delay: {{ $index * 0.1 }}s;">
            @if($car->images && count($car->images) > 0)
                <img src="{{ $car->images[0] }}" alt="{{ $car->name }}" class="w-full h-48 object-cover">
            @else
                <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <i class="fas fa-car text-gray-400 text-4xl"></i>
                </div>
            @endif
            
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold">{{ $car->name }}</h3>
                    <span class="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">{{ $car->year }}</span>
                </div>
                
                <p class="text-gray-600 mb-4">{{ Str::limit($car->description, 100) }}</p>
                
                <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-gas-pump mr-2"></i>
                        {{ $car->fuel_type }}
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-cogs mr-2"></i>
                        {{ $car->transmission }}
                    </div>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-red-600">{{ $car->formatted_price }}</span>
                    <a href="{{ route('cars.show', $car) }}" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                        View Details
                    </a>
                </div>
            </div>
        </div>
        @endforeach
    </div>

    <!-- Pagination -->
    @if($cars->hasPages())
    <div class="mt-8 fade-in-up">
        {{ $cars->links() }}
    </div>
    @endif

    @if($cars->count() == 0)
    <div class="text-center py-12 fade-in-up">
        <i class="fas fa-car text-gray-300 text-6xl mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
        <p class="text-gray-500">Try adjusting your filters to see more results.</p>
    </div>
    @endif
</div>
@endsection
