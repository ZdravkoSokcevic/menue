<?php
namespace App\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Translation;

/**
 * @template Array<Array> T
 */
interface TranslationsRepositoryInterface
{
    public function all(): Collection;
    public function store($data): array|Translation;
    public function storeMany(Array $data): bool;
    public function edit($id, array $data): bool | Translation;
    public function deleteKey($id): bool | null;
}

?>