<?php

namespace App\Http\Controllers;

use App\Http\Requests\AllergenTranslationsUpsertRequest;
use App\Http\Requests\CategoryTranslationsUpsertRequest;
use App\Http\Requests\ExtraTranslationsUpsertRequest;
use App\Http\Requests\IngridientTranslationsUpsertRequest;
use App\Http\Requests\MenuTranslationsUpsertRequest;
use App\Http\Requests\PreferenceTranslationsUpsertRequest;
use App\Http\Responses\CreateResponse;
use App\Models\Allergen;
use App\Models\Category;
use App\Models\Country;
use App\Models\Extra;
use App\Models\Ingridient;
use App\Models\Language;
use App\Models\Menu;
use App\Models\Preference;
use App\Models\Translation;
use DB;
use Illuminate\Http\Request;

class TranslationsController extends Controller
{
    public function addOrUpdateMenuTranslations(MenuTranslationsUpsertRequest $r, $menu_id)
    {
        $menu = Menu::find($menu_id);

        foreach($r->input('translations') as $code => $val) 
        {
            $country = Country::where('tld', '.' . $code)->first();
            $language = Language::where('code', $code)->first();
            $rowName = Translation::where([
                'language_id' => $language->id,
                'model_id' => $menu_id,
                'model' => 'menu',
                'model_class' => Menu::class,
                'key' => 'name',
            ])->first();

            $rowDescription = Translation::where([
                'language_id' => $language->id,
                'model_id' => $menu_id,
                'model' => 'menu',
                'model_class' => Menu::class,
                'key' => 'description',
            ])->first();
            

            $dataName = [
                'language_id' => $language->id,
                'model_id' => $menu_id,
                'key' => 'name',
                'model' => 'menu',
                'model_class' => Menu::class,
                'value' => $val['name']
            ];

            $dataDescription = [
                'language_id' => $language->id,
                'model_id' => $menu_id,
                'key' => 'description',
                'model' => 'menu',
                'model_class' => Menu::class,
                'value' => $val['description']
            ];

            if($rowName) {
                $rowName->update($dataName);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataName);
                $rowName = Translation::find($row);
            }

            if($rowDescription) {
                $rowDescription->update($dataDescription);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataDescription);
                $rowDescription = Translation::find($row);
            }
        }

        $newMenu = Menu::with('translations', 'translations.language')->where('id', $menu->id)->first();

        return new CreateResponse(true, ['item' => $newMenu]);

    }

    public function addOrUpdateCategoryTranslations(CategoryTranslationsUpsertRequest $r, $category_id)
    {
        $category = Category::find($category_id);

        foreach($r->input('translations') as $code => $val) 
        {
            $language = Language::where('code', $code)->first();
            $rowName = Translation::where([
                'language_id' => $language->id,
                'model_id' => $category_id,
                'model' => 'category',
                'model_class' => Category::class,
                'key' => 'name',
            ])->first();
            

            $dataName = [
                'language_id' => $language->id,
                'model_id' => $category_id,
                'key' => 'name',
                'model' => 'category',
                'model_class' => Category::class,
                'value' => $val['name']
            ];

            if($rowName) {
                $rowName->update($dataName);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataName);
                $rowName = Translation::find($row);
            }
        }

        $newCategory = Category::with('translations', 'translations.language')->where('id', $category->id)->first();
        return new CreateResponse(true, ['item' => $newCategory]);
    }

    public function addOrUpdateAllergenTranslations(AllergenTranslationsUpsertRequest $r, $allergen_id)
    {
        $allergen = Allergen::find($allergen_id);

        foreach($r->input('translations') as $code => $val) 
        {
            
            $language = Language::where('code', $code)->first();
            $rowName = Translation::where([
                'language_id' => $language->id,
                'model_id' => $allergen_id,
                'model' => 'allergen',
                'model_class' => Allergen::class,
                'key' => 'name',
            ])->first();
            

            $dataName = [
                'language_id' => $language->id,
                'model_id' => $allergen_id,
                'key' => 'name',
                'model' => 'allergen',
                'model_class' => Allergen::class,
                'value' => $val['name']
            ];

            if($rowName) {
                $rowName->update($dataName);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataName);
                $rowName = Translation::find($row);
            }
        }

        $newAllergen = Allergen::with('translations', 'translations.language')->where('id', $allergen->id)->first();
        return new CreateResponse(true, ['item' => $newAllergen]);
    }

    public function addOrUpdateIngridientTranslations(IngridientTranslationsUpsertRequest $r, $ingridient_id)
    {
        $ingridient = Ingridient::find($ingridient_id);

        foreach($r->input('translations') as $code => $val) 
        {
            $language = Language::where('code', $code)->first();
            $rowName = Translation::where([
                'language_id' => $language->id,
                'model_id' => $ingridient_id,
                'model' => 'ingridient',
                'model_class' => Ingridient::class,
                'key' => 'name',
            ])->first();
            

            $dataName = [
                'language_id' => $language->id,
                'model_id' => $ingridient_id,
                'key' => 'name',
                'model' => 'ingridient',
                'model_class' => Ingridient::class,
                'value' => $val['name']
            ];

            if($rowName) {
                $rowName->update($dataName);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataName);
                $rowName = Translation::find($row);
            }
        }

        $newIngridient = Ingridient::with('translations', 'translations.language')->where('id', $ingridient->id)->first();
        return new CreateResponse(true, ['item' => $newIngridient]);
    }

    public function addOrUpdateExtraTranslations(ExtraTranslationsUpsertRequest $r, $extra_id)
    {
        $extra = Extra::find($extra_id);

        foreach($r->input('translations') as $code => $val) 
        {
            $language = Language::where('code', $code)->first();
            $rowName = Translation::where([
                'language_id' => $language->id,
                'model_id' => $extra_id,
                'model' => 'extra',
                'model_class' => Extra::class,
                'key' => 'name',
            ])->first();
            

            $dataName = [
                'language_id' => $language->id,
                'model_id' => $extra_id,
                'key' => 'name',
                'model' => 'extra',
                'model_class' => Extra::class,
                'value' => $val['name']
            ];

            if($rowName) {
                $rowName->update($dataName);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataName);
                $rowName = Translation::find($row);
            }
        }

        $newExtra = Extra::with('translations', 'translations.language')->where('id', $extra->id)->first();
        return new CreateResponse(true, ['success' => true, 'item' => $newExtra]);
    }

    // SAME FOR MULTIPLE MODELS
    public function addOrUpdatePreferenceTranslations(PreferenceTranslationsUpsertRequest $r, $preference_id)
    {
        $preference = Preference::find($preference_id);

        foreach($r->input('translations') as $code => $val) 
        {
            $language = Language::where('code', $code)->first();
            $rowName = Translation::where([
                'language_id' => $language->id,
                'model_id' => $preference_id,
                'model' => 'preference',
                'model_class' => Preference::class,
                'key' => 'name',
            ])->first();
            

            $dataName = [
                'language_id' => $language->id,
                'model_id' => $preference_id,
                'key' => 'name',
                'model' => 'preference',
                'model_class' => Preference::class,
                'value' => $val['name']
            ];

            if($rowName) {
                $rowName->update($dataName);
            }else {
                $dataName['created_at'] = DB::raw('NOW()');
                $dataName['updated_at'] = DB::raw('NOW()');
                $row = Translation::insertGetId($dataName);
                $rowName = Translation::find($row);
            }
        }

        $newPreference = Preference::with('translations', 'translations.language')->where('id', $preference->id)->first();
        // $data = Preference::transformTranslations($newPreference);
        return new CreateResponse(true, ['item' => $newPreference]);
    }
}
