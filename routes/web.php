<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Public\MovieController;

Route::get('/', [MovieController::class, 'index'])->name('welcome');
Route::get('/movies/{movie}', [MovieController::class, 'show'])->name('movies.show');
Route::get('/subscriptions', [\App\Http\Controllers\Public\SubscriptionController::class, 'index'])->name('subscriptions.index');
Route::post('/subscriptions/subscribe', [\App\Http\Controllers\Public\SubscriptionController::class, 'subscribe'])->middleware('auth')->name('subscriptions.subscribe');
Route::get('/subscriptions/verify/{payment}', [\App\Http\Controllers\Public\SubscriptionController::class, 'verify'])->middleware('auth')->name('subscriptions.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/movies/{movie}/comment', [MovieController::class, 'comment'])->name('movies.comment');
    Route::post('/movies/{movie}/rate', [MovieController::class, 'rate'])->name('movies.rate');
    Route::delete('/movies/{movie}/unrate', [MovieController::class, 'unrate'])->name('movies.unrate');
});

Route::get('/dashboard', function () {
    if (auth()->user()->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('user.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/user/dashboard', function () {
        $request = request();
        $query = \App\Models\Movie::with('category')->where('status', 'completed');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        return Inertia::render('Dashboard', [
            'movies' => $query->latest()->get(),
            'categories' => \App\Models\Category::all(),
            'filters' => $request->only(['search', 'category']),
            'ads' => \App\Models\Ad::where('is_active', true)->where('position', 'home_top')->get(),
        ]);
    })->name('user.dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/movies/upload-chunk', [\App\Http\Controllers\Admin\MovieController::class, 'uploadChunk'])->name('movies.upload-chunk');
    Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('movies', \App\Http\Controllers\Admin\MovieController::class);
    Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->only(['index', 'update', 'destroy']);
    Route::resource('comments', \App\Http\Controllers\Admin\CommentController::class)->only(['index', 'destroy']);
    Route::resource('ads', \App\Http\Controllers\Admin\AdController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
