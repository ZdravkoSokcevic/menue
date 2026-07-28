<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CombosCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth('sanctum')->user();
        return $user && $user->role === 'admin';
    }

    protected function prepareForValidation()
    {
        $this->merge([
            // Converts the string "true"/"false" safely to an actual boolean
            'is_active' => filter_var($this->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $r = request();
        return [
            // TODO: add validation
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.portion_id' => 'required|exists:portions,id',
            'price' => [
                Rule::when($r->type == 'percent', 'min:0', 'max:100'),
                Rule::when($r->type == 'fixed', 'min:0', 'max:100000'),
            ],
            'active_times' => [
                'required',
                Rule::in('0', '1', '2')
            ],
            'times.*' => [
                // weekly
                Rule::when(
                    $r->active_times == '2', 
                    Rule::in('mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'),
                    'required'
                )
            ],

            // Time from and time to are optional
            // 'time_from' => '',
            // 'time_to' => '',
            // Start at cannot be in future, it can be today
            'start_at' => 'required|date|after_or_equal:today',
            // ends at cannot be in past too
            'end_at' => [
                'required',
                'date',
                'after_or_equal:today',
                'after:starts_at',
            ],
            'is_active' => 'required|boolean'
        ];
    }

    public function messages() {
        $r = request();
        return [
            'value.max' => $r->type === 'percent' 
                ? 'A percentage value cannot exceed 100%.' 
                : 'A fixed amount value cannot exceed 100,000.',
        ];
    }

}