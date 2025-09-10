<?php
    namespace App\Http\Responses;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Contracts\Support\Responsable;

    class EditResponse implements Responsable
    {
        protected $success;
        protected $custom_message;

        protected Array|Collection $data;
        public function __construct($success, $custom_message = '', Array $data=[])
        {
            $this->success = $success;
            $this->data = $data;
            if($custom_message != '')
                $this->custom_message = $custom_message;
        }

        public function toResponse($data)
        {
            $error_message = [
                'message' => ($data['resource']) ? 
                sprintf("Error during edit resource %s", $data['resource']) : 
                'Error editing resource!'
            ];
            $success_message = [
                'message' => ($data['resource']) ?
                sprintf(sprintf('%s edited successfully', $data['resource'])) :
                'Resource edited successfully'
            ];

            return ($this->success) ?
                new JsonResponse($success_message) :
                \response()->json(['message' => $this->custom_message ? $this->custom_message : $error_message], 409);
        }
    }


?>