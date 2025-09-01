<?php
	namespace App\Http\Repositories; 

	use Illuminate\Http\Request;
	use App\Interfaces\TableRepositoryInterface;
	use App\Models\Table;

	class TableRepository implements TableRepositoryInterface
	{
		private Table $table;
		public function getTables()
		{
			return Table::all();
		}

		public function findOne($id): Table
		{
			return Table::find($id);
		}

		public function storeTable(Array $data): Array|Table
		{
			$row = $this->table->create($data);
			return $row;
		}

		public function edit($id, Array $data): bool
		{
			$table = $this->table->find($id);
			$success = $table->update($data);
			return $success;
		}

		public function deleteTable($id): bool | null
		{
			$table = Table::find($id);
			if($table)
				return $table->delete();
			else return false;
		}
	}

?>