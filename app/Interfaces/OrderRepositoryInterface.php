<?php

namespace App\Interfaces;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
interface OrderRepositoryInterface
{
    public function store(Array $data);
    public function all(): Collection | LengthAwarePaginator;
    public function edit($id, Array $data): Order | bool;
    public function delete($id): bool|null;
}

?>