<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\QueuehouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\QueueerializesModels;
use Illuminateupport\Facadestorage;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\Laravel\Facades\Image; 
use Log;
use Storage;

class ResizeAndOptimizeMediaJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, Dispatchable, SerializesModels;

    // Give large files extra processing time
    public $timeout = 300; 
    protected $disk;
    /**
     * Create a new job instance.
     */
     public function __construct(
        protected string $tempPath,
        protected int $width,
        protected ?int $heigt = null, // auto-scale
        protected string $type = 'menu'
    ) {
        $this->disk = config('filesystems.default') == 'local' ? 'public' : 's3';
     }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // 1. Temporarily increase memory limit for this worker thread if needed
        ini_set('memory_limit', '512M');

        // 2. Initialize manager explicitly using the Imagick Driver
        $manager = new ImageManager(new Driver());

        // 3. Retrieve raw file bytes from storage
        $disk = Storage::disk($this->disk);
        $absolutePath = $disk->path($this->tempPath);

        // 4. Read, scale down, and encode
        $image = $manager->decode($absolutePath);
        // $image = $manager->make($absolutePath);
        
        // Scale down proportionally to a maximum width of 1200px
        if($image->width() > $this->width)
            $image->scale(width: $this->width); 

        // 5. Save the resized variant to your public directory
        // $destinationPath = 'uploads/resized_' . basename($this->tempPath);
        
        // Use 75%-80% quality compression to drastically shrink file size
        $encodedImage = $image->encodeUsingFormat(Format::JPEG, quality: 80); 
        Storage::disk('public')->put($this->tempPath, (string) $encodedImage);

        Log::info('Image is resized and optimized');

        // 6. Housekeeping: Remove the original giant file
        // $disk->delete($this->tempPath);
    }
}
