<?php

namespace App\Interfaces;

use App\Models\Menu;
use Illuminate\Http\Request;


interface MenuRepositoryInterface
{
		public function all(Request $r);
		public function store(Array $data): Array|Menu;
		public function edit($id, Array $data): bool | Menu;
		public function delete($id): bool|null;
}