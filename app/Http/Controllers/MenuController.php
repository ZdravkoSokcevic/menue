<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuCreateRequest;
use App\Http\Requests\MenuEditRequest;
use App\Http\Requests\MenuRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Models\Menu;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use App\Http\Repositories\MenuRepository;
use App\Services\MediaService;
use Illuminate\Support\Facades\Gate;
use Response;
use \App\Interfaces\MenuRepositoryInterface;

class MenuController extends Controller
{
    protected MenuRepositoryInterface $menuRepository;
    protected MediaService $mediaService;

    public function __construct(MenuRepository $me, protected MediaService $ms)
    {
        $this->menuRepository = $me;
        $this->mediaService = $ms;
    }

    /**
     * /
     * @return Collection
     *  Needs to be changed to return tables only for company
     */
    public function get(MenuRequest $r): Collection
    {
        if(Gate::denies('view-menu',  $r)) {
            return response(null,403);
        }
        return $this->menuRepository->all($r);

    }

    public function insert(MenuCreateRequest $r): CreateResponse
    {
        $data = $r->only((new Menu)->getFillable());
        // 1. Insert menu image and return picture path
        // 2. Replace data image path
        $picture_path = '';
        if($r->file('picture'))
            $picture_path = $this->mediaService->uploadPhoto($r->file('picture'), 'menu');
        if($picture_path != '') {
            $data['picture'] = $picture_path;
        }
        
        $success = $this->menuRepository->store($data);
        if($success)
            return new CreateResponse(true,   ['item'=> $success]);
        else return new CreateResponse(false, 'Could not create Menu!');
    }

    public function edit($id, MenuEditRequest $r): EditResponse
    {
        $data = $r->only((new Menu)->getFillable());
        $menu = Menu::find($id);
        if(!$menu)
            return new EditResponse(success: false, custom_message: 'Menu not found!');
        else {
            // only if picture is preset
            if($r->hasFile('picture')) {
                $picture_path = '';
                $old_picture_path = $menu->picture;
                if($r->file('picture'))
                    $picture_path = $this->mediaService->replacePhoto($old_picture_path, $r->file('picture'), 'menu');
                if($picture_path != '') {
                    $data['picture'] = $picture_path;
                }
            }

            $success = $this->menuRepository->edit($id, $data);
            if($success)
                return new EditResponse(true, ['item' => $success]);
            else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete($id)
    {
        $success = $this->menuRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
