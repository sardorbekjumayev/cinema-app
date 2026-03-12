<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Movie;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Pion\Laravel\ChunkUpload\Handler\HandlerFactory;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

class MovieController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Movies/Index', [
            'movies' => Movie::with('category')->latest()->get(),
            'categories' => Category::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Movies/Create', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres' => 'nullable|string',
            'country' => 'nullable|string',
            'year' => 'nullable|integer',
            'language' => 'nullable|string',
            'duration' => 'nullable|string',
            'age_limit' => 'nullable|string',
            'is_premium' => 'boolean',
            'poster' => 'nullable|image|max:2048',
            'video_path' => 'required|string', // Path returned from chunk upload
        ]);

        $movieData = $request->only([
            'category_id', 'title', 'description', 'genres', 
            'country', 'year', 'language', 'duration', 'age_limit', 'video_path',
            'is_premium'
        ]);

        if ($request->hasFile('poster')) {
            $movieData['poster'] = $request->file('poster')->store('posters', 'public');
        }

        $movieData['status'] = 'pending';
        $movie = Movie::create($movieData);

        \App\Jobs\TranscodeMovie::dispatch($movie);

        return redirect()->route('admin.movies.index')->with('success', 'Movie uploaded successfully. Transcoding started.');
    }

    public function uploadChunk(Request $request)
    {
        $receiver = new FileReceiver("file", $request, HandlerFactory::classFromRequest($request));

        if ($receiver->isUploaded() === false) {
            return response()->json(['error' => 'Upload failed'], 400);
        }

        $save = $receiver->receive();

        if ($save->isFinished()) {
            $file = $save->getFile();
            $path = $file->store('movies', 'public');
            
            return response()->json([
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'finished' => true
            ]);
        }

        $handler = $save->handler();

        return response()->json([
            "done" => $handler->getPercentageDone(),
            "finished" => false
        ]);
    }

    public function edit(Movie $movie)
    {
        return Inertia::render('Admin/Movies/Edit', [
            'movie' => $movie,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Movie $movie)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'genres' => 'nullable|string',
            'country' => 'nullable|string',
            'year' => 'nullable|integer',
            'language' => 'nullable|string',
            'duration' => 'nullable|string',
            'age_limit' => 'nullable|string',
            'is_premium' => 'boolean',
            'poster' => 'nullable|image|max:2048',
        ]);

        $movieData = $request->only([
            'category_id', 'title', 'description', 'genres', 
            'country', 'year', 'language', 'duration', 'age_limit',
            'is_premium'
        ]);

        if ($request->hasFile('poster')) {
            if ($movie->poster) {
                Storage::disk('public')->delete($movie->poster);
            }
            $movieData['poster'] = $request->file('poster')->store('posters', 'public');
        }

        $movie->update($movieData);

        return redirect()->route('admin.movies.index')->with('success', 'Kino muvaffaqiyatli tahrirlandi.');
    }

    public function destroy(Movie $movie)
    {
        try {
            if ($movie->poster) {
                Storage::disk('public')->delete($movie->poster);
            }
            if ($movie->video_path) {
                Storage::disk('public')->delete($movie->video_path);
            }
            
            $movie->delete();

            return redirect()->back()->with('success', 'Kino muvaffaqiyatli o\'chirildi.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Movie deletion failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Kinoni o\'chirishda xatolik yuz berdi: ' . $e->getMessage());
        }
    }
}
