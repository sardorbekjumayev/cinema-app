<?php

namespace App\Jobs;

use App\Models\Movie;
use FFMpeg\Format\Video\X264;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class TranscodeMovie implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $movie;

    /**
     * Create a new job instance.
     */
    public function __construct(Movie $movie)
    {
        $this->movie = $movie;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->movie->update(['status' => 'processing']);

        // Check if ffmpeg is installed
        $ffmpegExists = shell_exec('command -v ffmpeg');
        
        if (!$ffmpegExists) {
            \Log::warning("FFMpeg not found on system. Skipping transcoding for movie {$this->movie->id}.");
            $this->movie->update([
                'status' => 'completed',
                'versions' => [
                    'original' => $this->movie->video_path
                ]
            ]);
            return;
        }

        try {
            $lowBitrate = (new X264)->setKiloBitrate(1000);
            $midBitrate = (new X264)->setKiloBitrate(2500);
            $highBitrate = (new X264)->setKiloBitrate(5000);

            $fileName = pathinfo($this->movie->video_path, PATHINFO_FILENAME);
            
            $v720 = "movies/{$fileName}_720.mp4";
            $v1080 = "movies/{$fileName}_1080.mp4";

            FFMpeg::fromDisk('public')
                ->open($this->movie->video_path)
                ->export()
                ->toDisk('public')
                ->inFormat($midBitrate)
                ->resize(1280, 720)
                ->save($v720)
                ->export()
                ->toDisk('public')
                ->inFormat($highBitrate)
                ->resize(1920, 1080)
                ->save($v1080);

            $this->movie->update([
                'status' => 'completed',
                'versions' => [
                    '720p' => $v720,
                    '1080p' => $v1080,
                    'original' => $this->movie->video_path
                ]
            ]);

        } catch (\Exception $e) {
            $this->movie->update(['status' => 'failed']);
            \Log::error("Transcoding failed for movie {$this->movie->id}: " . $e->getMessage());
        }
    }
}
