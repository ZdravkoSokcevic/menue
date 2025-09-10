<?php
namespace App\Http\Repositories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use App\Interfaces\OrderRepositoryInterface;
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

    public function all(): Collection
    {
        return Order::all();
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