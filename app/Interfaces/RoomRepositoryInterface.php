<?php
	namespace App\Interfaces;

	use App\Models\Room;
	use Illuminate\Http\Request;

	interface RoomRepositoryInterface
	{
		public function getRooms(Request $r);
		public function findOne($id): Room | null;
		public function storeRoom(Array $data): Array|Room;

		public function generateQRCode(Room $t): bool;
		public function edit($id, Array $data): Room | bool;
		public function deleteRoom($id): bool|null;			
	}

?>