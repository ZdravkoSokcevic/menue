<?php
	namespace App\Interfaces;

	use App\Models\Table;

	interface TableRepositoryInterface
	{
		public function getTables();
		public function storeTable(Array $data): Array|Table;
		public function edit($id, Array $data): bool;
		public function deleteTable($id): bool|null;			
	}

?>