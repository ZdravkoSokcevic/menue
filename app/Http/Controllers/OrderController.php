<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderCreateRequest;
use App\Http\Requests\OrderEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use OrderRepository;
use OrderRepositoryInterface;
use Response;

class OrderController extends Controller
{
    private OrderRepository $orderRepository;

    public function __construct(OrderRepositoryInterface $orI)
    {
        $this->orderRepository = $orI;
    }

    public function get(): Collection
    {
        return $this->orderRepository->all();
    }

    public function create(OrderCreateRequest $r)
    {
        $data = $r->only((new Order)->getFillable());
        $success = $this->orderRepository->store($data);
        if($success)
            return new CreateResponse(true, ['data'=> $success]);
        else return new CreateResponse(false);
    }

    public function edit($id, OrderEditRequest $r): EditResponse
    {
        $success = $this->orderRepository->edit($id, $r->only((new Order)->getFillable()));
        if($success)
            return new EditResponse(true, ['row' => $success]);
        return new EditResponse(false);
    }

    public function delete($id)
    {
        $success =  $this->orderRepository->delete($id);
        if($success)
            return  Response::json(['message' => 'success']);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);    
    }   
}
