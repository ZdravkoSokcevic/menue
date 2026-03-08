<?php
namespace App\Interfaces;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;

interface CompanyRepositoryInterface
{
    public function all(): Collection;
    public function create($data);

    public function createDefaultCategories(Company $c);
    public function edit($id, $data);
    public function delete($id); 
}

?>