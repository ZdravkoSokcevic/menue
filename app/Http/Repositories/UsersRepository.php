<?php
namespace App\Http\Repositories;

use App\Interfaces\UsersRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Collection;

class UsersRepository implements UsersRepositoryInterface
{
    public User $user;
    public function __construct(User $u)
    {
        $this->user = $u;
    }

    public function all(): Collection
    {
        return $this->user->all();
    }
    public function create($data)
    {
        $user = new User($data);
        try {
            $user->save();
            return $user;
        }catch(err) {
            return false;
        }
    }

    public function edit($id, $data)
    {
        $user = User::find($id);
        $user->fill($data);
        try {
            $user->save();
            return $user;
        }catch(err) {
            return false;
        }
    }
    public function delete($id)
    {
        $user = User::find($id);
        try {

            return $user->delete();
        }catch (err)
        {
            return false;
        }
    } 
}

?>