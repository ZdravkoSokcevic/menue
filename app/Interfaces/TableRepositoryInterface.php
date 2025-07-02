<?php
	namespace App\Interfaces;

	interface TableRepositoryInterface
	{
		public function getTables();
		public function storeTable();
		public function deleteTable($id);			
	}

?>