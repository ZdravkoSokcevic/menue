<?php

namespace App\Http\Controllers;

use App\Http\Repositories\RoomRepository;
use App\Http\Requests\QRCodeDownloadRequest;
use App\Http\Requests\RoomsCreateRequest;
use App\Http\Requests\RoomsEditRequest;
use App\Http\Requests\TableCreateRequest;
use App\Http\Requests\TableEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\RoomRepositoryInterface;
use App\Interfaces\TableRepositoryInterface;
use App\Models\Room;
use App\Models\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Repositories\TableRepository;
use Illuminate\Http\Response;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class RoomsController extends Controller
{
    private RoomRepositoryInterface $roomRepository;

    public function __construct(RoomRepository $r) 
    {
        $this->roomRepository = $r;
    }

    public function index()
    {
        
    }

    public function get(Request $r): Collection | Response | ResponseFactory
    {
        // if(Gate::denies('view-room',  $r)) {
        //     return response(null,403);
        // }
        return $this->roomRepository->getRooms($r);
    }

    public function create(RoomsCreateRequest $r): CreateResponse
    {
        $data = $r->only(['name']);
        $data['company_id'] = $r->user()->getActiveCompanyId();
        $success = $this->roomRepository->storeRoom($data);
        // generate qrcode
        if($success) {
            $qrcode = $this->roomRepository->generateQRCode($success);
            $model = Room::with('code')->where('id', $success->id)->first();
            return new CreateResponse(true, ['item'=> $model]);
        }
        else return new CreateResponse(false, 'Cannot create room!');
    }

    public function edit($id, RoomsEditRequest $r): EditResponse 
    {
        $data = $r->only(Room::getFillableFields());
        $success = $this->roomRepository->edit($id, $data);
        // dd($success);
        if($success)
            return new EditResponse(true, [ 'message' => 'Successfully edited', 'item' => $success]);
        else return new EditResponse(false, 'Cannot edit row!');
    }

    public function delete($id): JsonResponse
    {
        $success = $this->roomRepository->deleteRoom($id);
        if($success)
            return new JsonResponse(['success'=> true, 'message' => 'success'], 200);
        else return new JsonResponse(['success' => false, 'message'=> 'Cannot delete room!'], 500);
    }

    public function downloadQRCodeImage(QRCodeDownloadRequest $r, $id)
    {
        $room = $this->roomRepository->findOne($id);
        
        $code = $room->code;
        // dd($code);

        if($code->qr_code) {
            $link = '/shorts/' . $code->code . '.svg';
            $disk = config('filesystems.default') == 'local' ? 'public' : 's3';
            $public_link = 'storage' . $link;

            // dd([
            //     'static_path' => 'storage/shorts/65c61786db72c7f45a6e023a97694c71764c1702.svg',
            //     'link' => $public_link
            // ]);

            // return response()->download(public_path('storage/shorts/65c61786db72c7f45a6e023a97694c71764c1702.svg'));
            // dd($link);
            // dd($code);
            if(Storage::disk($disk)->exists($link))
                return response()->download($public_link, $room->name . '.svg');
            else return response(null, 404);
        }else return response(null, 404);
    }
}
