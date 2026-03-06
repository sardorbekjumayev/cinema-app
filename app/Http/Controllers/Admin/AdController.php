<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Ads/Index', [
            'ads' => Ad::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ads/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'url' => 'nullable|url',
            'position' => 'required|string|in:home_top,sidebar,movie_page',
            'is_active' => 'required|boolean',
        ]);

        $imagePath = $request->file('image')->store('ads', 'public');

        Ad::create([
            'title' => $request->title,
            'image' => $imagePath,
            'url' => $request->url,
            'position' => $request->position,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('admin.ads.index')->with('success', 'Ad created successfully.');
    }

    public function edit(Ad $ad)
    {
        return Inertia::render('Admin/Ads/Edit', [
            'ad' => $ad,
        ]);
    }

    public function update(Request $request, Ad $ad)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'url' => 'nullable|url',
            'position' => 'required|string|in:home_top,sidebar,movie_page',
            'is_active' => 'required|boolean',
        ]);

        $data = $request->only(['title', 'url', 'position', 'is_active']);

        if ($request->hasFile('image')) {
            if ($ad->image) {
                Storage::disk('public')->delete($ad->image);
            }
            $data['image'] = $request->file('image')->store('ads', 'public');
        }

        $ad->update($data);

        return redirect()->route('admin.ads.index')->with('success', 'Ad updated successfully.');
    }

    public function destroy(Ad $ad)
    {
        if ($ad->image) {
            Storage::disk('public')->delete($ad->image);
        }
        $ad->delete();

        return redirect()->route('admin.ads.index')->with('success', 'Ad deleted successfully.');
    }
}
