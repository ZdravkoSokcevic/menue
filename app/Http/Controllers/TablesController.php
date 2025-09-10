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

class TablesController extends Controller
{
    private TableRepository $tableRepository;

    public function __construct(TableRepositoryInterface $t) 
    {
        $this->tableRepository = $t;
    }

    public function index()
    {
        
    }

    public function get(): Collection
    {
        return $this->tableRepository->getTables();
    }

    public function create(TableCreateRequest $r): CreateResponse
    {
        $data = $r->only(['name', 'company_id']);
        $success = $this->tableRepository->storeTable($data);
        if($success)
            return new CreateResponse(true);
        else return new CreateResponse(false, 'Cannot create table!');
    }

    public function edit($id, TableEditRequest $r): EditResponse
    {
        $data = $r->only(Table::getFillableFields());
        $success = $this->tableRepository->edit($id, $data);
        if($success)
            return new EditResponse(true, 'Successfully edited', ['data' => $this->tableRepository->findOne($id)]);
        else return new EditResponse(false, 'Cannot edit row!');
    }

    public function delete($id): JsonResponse
    {
        $success = $this->tableRepository->deleteTable($id);
        if($success)
            return new JsonResponse(['success'=> true, 'message' => 'Table deleted!'], 200);
        else return new JsonResponse(['success' => false, 'message'=> 'Cannot delete table!'], 500);
    }
}
