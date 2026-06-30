<?php
    namespace App\Services;
    
    use App\Jobs\ResizeAndOptimizeMediaJob;
    use Illuminate\Http\UploadedFile;
    use Illuminate\Support\Facades\Storage;
    use ImageOptimizer;
    class MediaService
    {
        private function resizeCropAndOptimizePicture(UploadedFile $file, $folder)
        {
            // Do things here
            return $file;
        }

        public function uploadPhoto(UploadedFile $file, string $folder)
        {
            $filename = $file->hashName();

            $disk = config('filesystems.default') == 'local' ? 'public' : 's3';

            // if($folder == 'menu')
            $file = $this->resizeCropAndOptimizePicture($file, $folder);

            $path = $file->storeAs($folder, $filename, $disk);

            // try {
                ResizeAndOptimizeMediaJob::dispatch($path, 800, null, $folder);
                // dd($p);
            // }catch(err) {

            // }


            // dd($path);
            return $path;
        }

        public function replacePhoto(string $old_file_path, UploadedFile $file, string $folder)
        {

            $filename = $file->hashName();

            $disk = config('filesystems.default') == 'local' ? 'public' : 's3';

            if($folder == 'menu')
                $file = $this->resizeCropAndOptimizePicture($file, $folder);

            $path = $file->storeAs($folder, $filename, $disk);

            ResizeAndOptimizeMediaJob::dispatch($path, 800, null, $folder);
            

            if($path) {
                
                // remove old photo
                $file = Storage::disk($disk)->get($old_file_path);
                $fileExists = Storage::disk($disk)->exists($old_file_path);
                if($fileExists)
                    Storage::disk($disk)->delete($old_file_path);
            }
            return $path;
        } 
    }

?>
