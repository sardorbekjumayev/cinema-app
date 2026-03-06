<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use App\Models\Category;
use App\Models\Movie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MovieController extends Controller
{
    public function index(Request $request)
    {
        $query = Movie::with('category')->where('status', 'completed');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return Inertia::render('Welcome', [
            'movies' => $query->latest()->get(),
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category']),
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'ads' => Ad::where('is_active', true)->where('position', 'home_top')->get(),
        ]);
    }

    public function show(Movie $movie)
    {
        if ($movie->status !== 'completed' && (!auth()->check() || auth()->user()->role !== 'admin')) {
            abort(404);
        }
        $movie->load(['category', 'comments.user', 'ratings']);
        
        $canWatch = true;
        $authCheck = auth()->check();
        
        if ($movie->is_premium) {
            $canWatch = $authCheck && (
                auth()->user()->role === 'admin' || 
                (in_array(auth()->user()->status, ['premium', 'pro']) && 
                 (is_null(auth()->user()->subscription_expires_at) || auth()->user()->subscription_expires_at > now()))
            );
        }

        return Inertia::render('Movies/Show', [
            'movie' => $movie,
            'can_watch' => $canWatch,
            'average_rating' => (float) $movie->average_rating,
            'user_rating' => $authCheck 
                ? $movie->ratings()->where('user_id', auth()->id())->first()?->stars 
                : null,
            'ads' => Ad::where('is_active', true)->where('position', 'movie_page')->get(),
        ]);
    }

    public function comment(Request $request, Movie $movie)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $movie->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        return back()->with('success', 'Comment added successfully.');
    }

    public function rate(Request $request, Movie $movie)
    {
        $request->validate([
            'stars' => 'required|integer|min:1|max:5',
        ]);

        $movie->ratings()->updateOrCreate(
            ['user_id' => auth()->id()],
            ['stars' => $request->stars]
        );

        return back()->with('success', 'Rating submitted successfully.');
    }

    public function unrate(Movie $movie)
    {
        $movie->ratings()->where('user_id', auth()->id())->delete();
        return back()->with('success', 'Rating removed successfully.');
    }
}
