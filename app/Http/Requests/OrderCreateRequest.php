<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    // need to replace string or array of strings
    // to array for extras and preferences
    // for each item
    public function prepareForValidation(): void
    {
        // Param validation
        $request = $this->request->all();
        foreach($request['items'] as &$item) {
            $extaIds = [];
            $preferenceIds = [];
            if(array_key_exists('extras', $item) && is_string($item['extras'])) {
                // replace here
                // 2 possible solutions [1,2] fe. or 1,2
                if(!is_array($item['extras'])) {
                    $no_brackets_left = str_replace('[', '', $item['extras']);
                    $arr = str_replace(']', '', $item['extras']);
                    try {
                        $extaIds = explode(',', $arr);
                    }catch(err) {

                    }
                }
            }
            // replace new array contains extra ids in items array
            $item['extras'] = $extaIds;

            if(array_key_exists('preferences', $item) && is_string($item['preferences'])) {
                // replace here
                // 2 possible solutions [1,2] fe. or 1,2
                if(!is_array($item['preferences'])) {
                    $no_brackets_left = str_replace('[', '', $item['preferences']);
                    $arr = str_replace(']', '', $item['preferences']);
                    try {
                        $preferenceIds = explode(',', $arr);
                    }catch(err) {

                    }
                }
            }

            // replace new array contains preference ids in items array
            $item['preferences'] = $preferenceIds;
        }

        $this->replace($request);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // dd($this->request);
        return [
            'items.*.menu_id' => 'exists:menus,id',
            'items.*.portion_id' => 'exists:portions,id',
            'items.*.quantity' => 'min:1|max:20',
            'items.*.extras.*' => 'exists:menu_extras,id',
            'items.*.preferences.*' => 'exists:menu_preferences,id',
            'items.*.note' => 'string|max:255'
        ];
    }
}
