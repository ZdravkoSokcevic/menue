<?php
namespace App\Interfaces;

use App\Models\Company;
use \Illuminate\Support\Collection;

interface UsersRepositoryInterface
{
    public function all(): Collection;
    public function create($data);
    public function edit($id, $data);
    public function delete($id); 
}

?>