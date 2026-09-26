<?php
	namespace App\Http\Repositories; 

	use App\Models\Code;
	use App\Models\Room;
	use Illuminate\Http\Request;
	use App\Interfaces\RoomRepositoryInterface;
	use Illuminate\Support\Facades\Storage;
	use SimpleSoftwareIO\QrCode\Facades\QrCode;

	class RoomRepository implements RoomRepositoryInterface
	{
		private Room $room;

		public function __construct()
		{
			$this->room = new Room();
		}
		public function getRooms(Request $r)
		{
			$user = $r->user();
			$isAdmin = $user->isAdmin();
			// allow admin and demo users to see every company list
			$isNotAdmin = $user->isNotAdminOrDemo();
			$q = Room::with('code');
			if($isNotAdmin)
				$q->where('company_id', $user->getActiveCompanyId());
			else if ($user->getActiveCompanyId())
				$q->where('company_id', $user->getActiveCompanyId());
			return $q->get();
		}

		public function findOne($id): Room | null
		{
			return Room::find($id);
		}

		public function storeRoom(Array $data): Array|Room
		{
			$this->room->fill($data);
			$this->room->save();
			return $this->room;
		}

		public function generateQRCode(Room $room): bool
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
				'room_id' => $room->id
			]);

			if($code->save())
				return true;
			else return false;
		}

		public function edit($id, Array $data): Room | bool
		{
			$row = $this->room->find($id);
			$this->room = $row;
			$this->room->fill($data);
			if($this->room->save())
				return $this->room;
			return false;
		}

		public function deleteRoom($id): bool | null
		{
			$room = Room::find($id);
			if($room)
				return $room->delete();
			else return false;
		}
	}

?>