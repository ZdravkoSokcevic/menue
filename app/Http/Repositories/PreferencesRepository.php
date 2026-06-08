<?php
    namespace App\Http\Repositories;
    use App\Models\Preference;
    use App\Interfaces\PreferencesRepositoryInterface;
    use Illuminate\Support\Collection;

    class PreferencesRepository implements PreferencesRepositoryInterface
    {
        private Preference $preference;
        
        public function __construct()
        {
            $this->preference = new Preference();
        }
        public function all(): Collection
        {
            $q = Preference::with('translations', 'translations.language', 'translations.language.countries');
            $data = $q->get();
            return collect($data->toArray());
        }
        public function create($data): Preference | bool 
        {
            $this->preference->fill($data);
            $this->preference->save();
            return $this->preference->fresh();
        }
        public function edit($id, $data): Preference | bool
        {
            $row = $this->preference->find($id);
            $row->fill($data);
            if($row->save())
                return $row->fresh();
            else return false;
        }
        public function delete($id): bool | null
        {
            return $this->preference->find($id)->delete();
        }
    }

?>