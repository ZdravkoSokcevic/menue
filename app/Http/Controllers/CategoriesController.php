<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriesCreateRequest;
use App\Http\Requests\CategoriesEditRequest;
use App\Http\Responses\CreateResponse;
use App\Http\Responses\EditResponse;
use App\Interfaces\CategoriesRepositoryInterface;
use App\Models\Category;
use \App\Http\Repositories\CategoriesRepository;
use App\Services\MediaService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Response;

class CategoriesController extends Controller
{
    protected CategoriesRepositoryInterface $categoriesRepository;
    protected MediaService $mediaService;
    public function __construct(CategoriesRepository $ce, MediaService $ms)
    {
        $this->categoriesRepository = $ce;
        $this->mediaService = $ms;
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

        $picture_path = '';
        if($r->file('picture'))
            $picture_path = $this->mediaService->uploadPhoto($r->file('picture'), 'categories');
        if($picture_path != '') {
            $data['picture'] = $picture_path;
        }

        // dd($data);
        $success = $this->categoriesRepository->store($data);
        if($success)
            return new CreateResponse(true,  [ 'item' => $success ]);
        else return new CreateResponse(false, 'Could not create Menu!');
    }

    public function edit($id, CategoriesEditRequest $r): EditResponse
    {
        $data = $r->only((new Category)->getFillable());
        $category = Category::find($id);
        if(!$category)
            return new EditResponse(success: false, custom_message: 'Category not found!');
        else {
        // only if picture is preset
            if($r->hasFile('picture')) {
                $picture_path = '';
                $old_picture_path = $category->picture;
                if($r->file('picture'))
                    $picture_path = $this->mediaService->replacePhoto($old_picture_path, $r->file('picture'), 'categories');
                if($picture_path != '') {
                    $data['picture'] = $picture_path;
                }
            }

            $company = $this->categoriesRepository->edit($id, $data);
            if($company)
                return new EditResponse(true, ['item' => $company]);
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
