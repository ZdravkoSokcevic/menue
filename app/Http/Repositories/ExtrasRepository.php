<?php
    namespace App\Http\Repositories;
    use App\Interfaces\ExtrasRepositoryInterface;
    use Illuminate\Support\Collection;
    use App\Models\Extra;

    class ExtrasRepository implements ExtrasRepositoryInterface
    {
        private Extra $extra;
        
        public function __construct()
        {
            $this->extra = new Extra();
        }
        public function all(): Collection
        {
            $q = Extra::query();
            return $q->get();
        }
        public function create($data): Extra | bool
        {
            $this->extra->fill($data);
            $this->extra->save();
            return $this->extra->fresh();
        }
        public function edit($id, $data): Extra | bool
        {
            $row = $this->extra->find($id);
            $row->fill($data);
            if($row->save())
                return $row->fresh();
            else return false;  
        }
        public function delete($id): bool | null
        {
            return $this->extra->find($id)->delete();   
        }
    }

?>