<?php

namespace App\Interfaces;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
interface OrderRepositoryInterface
{
    public function store(Array $data);
    public function all(): Collection;
    public function edit($id, Array $data): Order | bool;
    public function delete($id): bool|null;
}

?>