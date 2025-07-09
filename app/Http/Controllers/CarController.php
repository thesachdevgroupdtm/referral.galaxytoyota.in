<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::query();
        
        // Filter by brand
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }
        
        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Search by model
        if ($request->filled('search')) {
            $query->where('model', 'like', '%' . $request->search . '%');
        }
        
        $cars = $query->paginate(12);
        $brands = Car::distinct()->pluck('brand');
        
        return view('cars.index', compact('cars', 'brands'));
    }
    
    public function show(Car $car)
    {
        return view('cars.show', compact('car'));
    }
    
    // API methods for mobile/AJAX
    public function apiIndex(Request $request)
    {
        $query = Car::query();
        
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }
        
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        if ($request->filled('search')) {
            $query->where('model', 'like', '%' . $request->search . '%');
        }
        
        $cars = $query->paginate(12);
        
        return response()->json($cars);
    }
    
    public function apiShow(Car $car)
    {
        return response()->json($car);
    }
}
