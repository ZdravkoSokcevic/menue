<?php
namespace App\Interfaces;

use App\Models\Extra;
use Illuminate\Support\Collection;

interface ExtrasRepositoryInterface
{
    public function all(): Collection;
    public function create($data): Extra | bool ;
    public function edit($id, $data): Extra | bool;
    public function delete($id): bool | null; 
}

?>