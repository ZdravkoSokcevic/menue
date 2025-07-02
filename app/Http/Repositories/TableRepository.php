<?php
	namespace App\Repositories; 

	use Illuminate\Http\Request;
	use App\Interfaces\TableRepositoryInterface;
	use App\Models\Table;

	class TableRepository implements TableRepositoryInterface
	{
		public function getTables()
		{
			return Table::all();
		}

		public function storeTable()
		{

		}

		public function deleteTable($id)
		{
			
		}
	}

?>