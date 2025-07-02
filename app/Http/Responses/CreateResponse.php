<?php
    namespace App\Http\Responses;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Contracts\Support\Responsable;

    class CreateResponse implements Responsable
    {
        protected $success;
        public function __construct($success)
        {
            $this->success = $success;
        }

        public function toResponse($data)
        {
            $error_message = [
                'message' => ($data['resource']) ? 
                sprintf("Error creating resource %s", $data['resource']) : 
                'Error creating resource!'
            ];
            $success_message = [
                'message' => ($data['resource']) ?
                sprintf(sprintf('%s created successfully', $data['resource'])) :
                'Resource created successfully'
            ];

            return ($this->success) ?
                new JsonResponse($success_message) :
                \response()->json($error_message, 409);
        }
    }


?>