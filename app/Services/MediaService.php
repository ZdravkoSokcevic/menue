<?php
    namespace App\Services;
    
    use Illuminate\Http\UploadedFile;
    use Illuminate\Support\Facades\Storage;
    class MediaService
    {
        private function resizeCropAndOptimizeMenuPicture(UploadedFile $file)
        {
            // Do things here
            return $file;
        }

        public function uploadPhoto(UploadedFile $file, string $folder)
        {
            $filename = $file->hashName();

            $disk = config('filesystems.default') == 'local' ? 'public' : 's3';

            if($folder == 'menu')
                $file = $this->resizeCropAndOptimizeMenuPicture($file);

            $path = $file->storeAs($folder, $filename, $disk);

            // dd($path);
            return $path;
        }
    }

?>
