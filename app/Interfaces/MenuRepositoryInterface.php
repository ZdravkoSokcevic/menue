<?php

namespace App\Interfaces;

use App\Models\Menu;


interface MenuRepositoryInterface
{
		public function all();
		public function store(Array $data): Array|Menu;
		public function edit($id, Array $data): bool;
		public function delete($id): bool|null;
}