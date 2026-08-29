<?php

namespace App\Http\Controllers;

use App\Http\Repositories\OrderRepository;
use App\Http\Requests\OrderCreateRequest;
use App\Http\Requests\OrderEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\OrderRepositoryInterface;
use App\Models\Code;
use App\Models\MenuExtra;
use App\Models\Order;
use Gate;
use Illuminate\Database\Eloquent\Collection;
use Request;
use Response;
use Str;

class OrderController extends Controller
{
    private OrderRepositoryInterface $orderRepository;

    public function __construct(OrderRepository $orI)
    {
        $this->orderRepository = $orI;
    }

    public function get(Request $r): mixed
    {
        if(Gate::denies('view-orders',  $r)) {
            return Response::json(null, 403);
        }
        return $this->orderRepository->all();
    }

    public function create(OrderCreateRequest $r)
    {
        $r->merge([
            'slug' => Str::random(36)
        ]);
        $data = $r->only((new Order)->getFillable());
        
        // find Table from QRCodeSlug
        $table = Code::where('code', $r->input('qrCodeSlug'))->first();
        
        $table_id = $table->id;

        $data['table_id'] = $table_id;

        $res = $this->orderRepository->store($data);
        // dd($res instanceof Order);
        if($res && $res instanceof Order) {
            // Store order items
            foreach($r->items as $item) {
                $selectedExtras = [];
                $orItem = $res->items()->create($item);
                // dd($orItem);
                foreach($item['extras'] as $extra) {

                    $orItem->modifications()->create([
                        'menu_id' => $item['menu_id'],
                        'order_item_id' => $orItem->id,
                        'menu_extras_id' => $extra
                    ]);
                }

                $selectedPreferences = [];
                // dd($item['preferences']);
                foreach($item['preferences'] as $preference) {
                    $selectedPreferences[] = $preference;
                    // create menu preference

                    $orItem->modifications()->create([
                        'menu_id' => $item['menu_id'],
                        'order_item_id' => $orItem->id,
                        'menu_preferences_id' => $preference
                    ]);
                }
            }
            $row = Order::with([
                'items', 
                'items.modifications', 
                'items.modifications.extra', 
                'items.modifications.preference' , 
                'items.extras', 
                'items.preferences'
            ])
                ->where('id', $res->id)->first();
            return new CreateResponse(true, ['data'=> $row, 'success'=>true]);
        }
        else return new CreateResponse(false);
    }

    public function edit($id, OrderEditRequest $r): EditResponse
    {
        $res = $this->orderRepository->edit($id, $r->only((new Order)->getFillable()));
        if($res)    
            return new EditResponse(true, ['row' => $res, 'success' => true, 'message' => 'success']);
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
