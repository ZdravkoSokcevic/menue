<?php

namespace App\Http\Controllers;

use App\Http\Repositories\OrderRepository;
use App\Http\Requests\OrderCreateRequest;
use App\Http\Requests\OrderEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\OrderRepositoryInterface;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
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

        $res = $this->orderRepository->store($data);
        if($res && $res instanceof App\Models\Order) {
            // Store order items
            foreach($r->items as $item) {
                // create menu extras
                $selectedExtras = [];
                foreach($item['extras'] as $extra) {
                    $selectedExtras[] = $extra;
                }
                $res->items()->extra()->sync($selectedExtras);
                // create menu preference
                $selectedPreferences = [];
                foreach($item['preferences'] as $preference) {
                    $selectedPreferences[] = $preference;
                }
                $res->items()->preferences()->sync($preference);

                // create notes
                // $note = OrderModification::insert([

                // ]);
            }
            $row = Order::with(['items', 'items.extras', 'items.preferences'])
                ->where('id', $res->id)->first();
            return new CreateResponse(true, ['data'=> $row]);
        }
        else return new CreateResponse(false);
    }

    public function edit($id, OrderEditRequest $r): EditResponse
    {
        $res = $this->orderRepository->edit($id, $r->only((new Order)->getFillable()));
        if($res)    
            return new EditResponse(true, ['row' => $res]);
        else return new EditResponse(false);
    }

    public function delete($id)
    {
        $success =  $this->orderRepository->delete($id);
        if($success)
            return  Response::json(['message' => 'success']);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);    
    }   
}
