<?php

namespace App\Http\Repositories;
use App\Models\Translation;
use Illuminate\Database\Eloquent\Collection;
use App\Interfaces\TranslationsRepositoryInterface;

/**
 * @template Array<Array> T
 */
class TranslationsRepository implements TranslationsRepositoryInterface
{
    private Translation $translation;
    public function __construct()
    {
        $this->translation = new Translation();
    }
    public function all(): Collection
    {
        return Translation::all();
    }
    public function store($data): array|Translation
    {
        $this->translation->fill($data);
        $this->translation->save();
        return $this->translation;
    }

    public function storeMany(Array $data): bool
    {
        $success = true;
        foreach($data as $row) {
           $s = Translation::create($row);
            if(!$s) {
                $success = $s;
                break;
            }
        }
        return $success;
    }
    public function edit($id, array $data): bool | Translation
    {
        $row = $this->translation->find($id);
        if($row)
            return $row->update($data);
        return false;
    }
    public function deleteKey($id): bool | null
    {
        return $this->translation->find($id)->delete();
    }
}
?>