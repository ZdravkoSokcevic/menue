<?php
namespace App\Interfaces;

use App\Models\License;
use Illuminate\Database\Eloquent\Collection;

interface LicenseRepositoryInterface
{
    public function all(): Collection;
    public function store(Array $data);
    public function edit($id, Array $data): bool | License;
    public function delete($id): bool | null;
}

?>