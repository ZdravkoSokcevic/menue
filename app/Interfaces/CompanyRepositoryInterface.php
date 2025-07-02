<?php
namespace App\Interfaces;

use Illuminate\Database\Collection;

interface CompanyRepositoryInterface
{
    public function all(): Collection;
    public function create($data);
    public function edit($id, $data);
    public function delete($id); 
}

?>