<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Movie;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'movies' => Movie::count(),
                'users' => User::count(),
                'categories' => Category::count(),
                'comments' => Comment::count(),
            ]
        ]);
    }
}
