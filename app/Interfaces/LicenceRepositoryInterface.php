<?php
namespace App\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface LicenceRepositoryInterface
{
    public function all(): Collection;
    public function store(Array $data);
    public function edit($id, Array $data): bool;
    public function delete($id): bool | null;
}

?>