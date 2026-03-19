<?php
	namespace App\Interfaces;

	use App\Models\Table;

	interface TableRepositoryInterface
	{
		public function getTables();
		public function findOne($id): Table | null;
		public function storeTable(Array $data): Array|Table;

		public function generateQRCode(Table $t): bool;
		public function edit($id, Array $data): Table | bool;
		public function deleteTable($id): bool|null;			
	}

?>