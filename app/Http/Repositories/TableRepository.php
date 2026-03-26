<?php
	namespace App\Http\Repositories; 

	use App\Models\Code;
	use Illuminate\Http\Request;
	use App\Interfaces\TableRepositoryInterface;
	use App\Models\Table;
	use Illuminate\Support\Facades\Storage;
	use SimpleSoftwareIO\QrCode\Facades\QrCode;

	class TableRepository implements TableRepositoryInterface
	{
		private Table $table;

		public function __construct()
		{
			$this->table = new Table();
		}
		public function getTables(Request $r)
		{
			$isAdmin = auth('sanctum')->user()->isAdmin();
			// allow admin and demo users to see every company list
			$isNotAdmin = auth('sanctum')->user()->isNotAdminOrDemo();
			$q = Table::with('code');
			if($isNotAdmin)
				$q->where('company_id', $r->input('company_id'));
			else if ($r->filled('company_id'))
				$q->where('company_id', $r->input('company_id'));
			return $q->get();
		}

		public function findOne($id): Table | null
		{
			return Table::find($id);
		}

		public function storeTable(Array $data): Array|Table
		{
			$this->table->fill($data);
			$this->table->save();
			return $this->table;
		}

		public function generateQRCode(Table $t): bool
		{
			$code = \sha1(time());
			$app_url = config('app.url');
			$local_path = '/shorts/'. $code;
			$url = $app_url  . $local_path;
			$disk = config('filesystems.default') == 'local' ? 'public' : 's3';
			// added .svg for file save
			$local_file_path = '/shorts/'. $code . '.svg';
			// dd([
			// 	'code' => $code,
			// 	'url' => $app_url,
			// 	$url => $url,
			// ]);

			$qr_code = QrCode::size(300)->generate($url);
			$path = Storage::disk($disk)->put($local_file_path, $qr_code );
			$code = new Code([
				'code' => $code,
				'qr_code' => $local_path,
				'table_id' => $t->id
			]);

			if($code->save())
				return true;
			else return false;
		}

		public function edit($id, Array $data): Table | bool
		{
			$row = $this->table->find($id);
			$this->table = $row;
			$this->table->fill($data);
			if($this->table->save())
				return $this->table;
			return false;
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