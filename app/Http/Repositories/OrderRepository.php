<?php
namespace App\Http\Repositories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use App\Interfaces\OrderRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
class OrderRepository implements OrderRepositoryInterface
{
    private Order $order;
    public function __construct()
    {
        $this->order = new Order();
    }
    public function store(Array $data)
    {
        $this->order->fill($data);
        // Should include potential try/catch block
        $this->order->save();
        return $this->order;
    }

    public function all(): Collection | LengthAwarePaginator
    {
        // TODO: return just orders that are 
        // from the menu from that restaurant/hotel
        $q =  Order::with([
                'table',
                'items', 
                'items.menu', 
                'items.modifications', 
                'items.modifications.extra', 
                'items.modifications.preference' => function($q) {
            // $q->select('items.menu.id');
            
        }])
        ->whereHas('items')
            // 0 - ordered / unprocessed
            // 1 - ordered / processed
            // 2 - processed / finished
            // 3 - paid
            ->orderBy('status', 'asc')
            ->orderBy('created_at', 'asc');

        if(request()->has('status'))
            $q->where('status', request()->input('status'));

        return $q->get();
    }

    public function edit($id, $data): Order|bool
    {
        $row = $this->order->find($id);
        if($row && $row->update($data))
            return $row;
        return false;
    }

    public function delete($id): bool | null
    {
        return $this->order->find($id)->delete();
    }
}

?>