<?php
namespace App\Interfaces;

use App\Models\Discount;
use Illuminate\Http\Request;

interface DiscountsRepositoryInterface
{
    public function all(Request $r);
    public function store(Array $data);
    public function edit($id, Array $data): Discount | bool;
    public function delete($id): bool | null;
}

?>