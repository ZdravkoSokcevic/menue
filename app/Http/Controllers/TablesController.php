<?php

namespace App\Http\Controllers;

use App\Http\Requests\TableCreateRequest;
use App\Http\Requests\TableEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\TableRepositoryInterface;
use App\Models\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Repositories\TableRepository;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class TablesController extends Controller
{
    private TableRepositoryInterface $tableRepository;

    public function __construct(TableRepository $t) 
    {
        $this->tableRepository = $t;
    }

    public function index()
    {
        
    }

    public function get(Request $r): Collection | Response
    {
        if(Gate::denies('view-table',  $r)) {
            return response(null,403);
        }
        return $this->tableRepository->getTables($r);
    }

    public function create(TableCreateRequest $r): CreateResponse
    {
        $data = $r->only(['name', 'company_id']);
        $success = $this->tableRepository->storeTable($data);
        // generate qrcode
        if($success) {
            $qrcode = $this->tableRepository->generateQRCode($success);
            $model = Table::with('code')->where('id', $success->id)->first();
            return new CreateResponse(true, ['item'=> $model]);
        }
        else return new CreateResponse(false, 'Cannot create table!');
    }

    public function edit($id, TableEditRequest $r): EditResponse 
    {
        $data = $r->only(Table::getFillableFields());
        $success = $this->tableRepository->edit($id, $data);
        // dd($success);
        if($success)
            return new EditResponse(true, [ 'message' => 'Successfully edited', 'item' => $success]);
        else return new EditResponse(false, 'Cannot edit row!');
    }

    public function delete($id): JsonResponse
    {
        $success = $this->tableRepository->deleteTable($id);
        if($success)
            return new JsonResponse(['success'=> true, 'message' => 'success'], 200);
        else return new JsonResponse(['success' => false, 'message'=> 'Cannot delete table!'], 500);
    }
}
