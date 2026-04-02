<?php
    namespace App\Interfaces;
    use App\Models\Preference;
    use Illuminate\Support\Collection;

    interface PreferencesRepositoryInterface
    {
        public function all(): Collection;
        public function create($data): Preference | bool;
        public function edit($id, $data): Preference | bool;
        public function delete($id): bool | null; 
    }

?>