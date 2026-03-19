<?php
namespace App\Http\Repositories;

use App\Interfaces\LicenseRepositoryInterface;
use App\Models\License;
use Illuminate\Database\Eloquent\Collection;

class LicenseRepository implements LicenseRepositoryInterface
{
    private License $license;
    public function __construct()
    {
        $this->license = new License();
    }
    public function all(): Collection
    {
        return $this->license->all();
    }
    public function store(Array $data)
    {
        $this->license->fill($data);
        $this->license->save();
        return $this->license;
    }
    public function edit($id, Array $data): bool | License
    {
        $row = $this->license->find($id);
        if($row->update($data))
            return $row;
        return false;
    }
    public function delete($id): bool | null
    {
        return $this->license->find($id)->delete();
    }
}

?>