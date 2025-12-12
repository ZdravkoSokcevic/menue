<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriesCreateRequest;
use App\Http\Requests\CategoriesEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\CategoriesRepositoryInterface;
use App\Models\Category;
use \App\Http\Repositories\CategoriesRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Response;

class CategoriesController extends Controller
{
    protected CategoriesRepositoryInterface $categoriesRepository;
    public function __construct(CategoriesRepository $ce)
    {
        $this->categoriesRepository = $ce;
    }  

    /**
     * /
     * @return Collection
     *  Needs to be changed to return tables only for company
     */
    public function get(): Collection
    {
        return $this->categoriesRepository->all();
    }

    public function insert(CategoriesCreateRequest $r): CreateResponse
    {
        $data = $r->only((new Category())->getFillable());
        // dd($data);
        $success = $this->categoriesRepository->store($data);
        if($success)
            return new CreateResponse(true, 'Created successfully!');
        else return new CreateResponse(false, 'Could not create Menu!');
    }

    public function edit($id, CategoriesEditRequest $r): EditResponse
    {
        $data = $r->only((new Category)->getFillable());
        $menu = Category::find($id);
        if(!$menu)
            return new EditResponse(success: false, custom_message: 'Company not found!');
        else {
            $success = $this->categoriesRepository->edit($id, $data);
            if($success)
                return new EditResponse(true);
            else return new EditResponse(false, 'Could not edit menu!');
        }
    }

    public function delete($id)
    {
        $success = $this->categoriesRepository->delete($id);
        if($success)
            return Response::json([ 'message'=> 'success' ]);
        else return Response::json([ 'message'=> 'Failed to delete resource' ], 404);
    }
}
