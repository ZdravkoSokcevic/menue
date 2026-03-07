<?php
    namespace App\Http\Responses;
    use Illuminate\Http\JsonResponse;
    use Illuminate\Contracts\Support\Responsable;

    class CreateResponse implements Responsable
    {
        protected $success;
        protected $custom_message;
        public function __construct($success, $custom_message = '')
        {
            $this->success = $success;
            if($custom_message != '')
                $this->custom_message = $custom_message;
        }

        public function toResponse($data)
        {
            // data bag is used for success message also
            $data_bag = $this->custom_message != '' ? $this->custom_message : '';
            $error_message = [
                'message' => ($data['resource']) ? 
                sprintf("Error creating resource %s", $data['resource']) : 
                'Error creating resource!'
            ];
            $success_message = [
                'message' => ($data['resource']) ?
                sprintf(sprintf('%s created successfully', $data['resource'])) :
                'Resource created successfully',
            ];

            if(is_array($data_bag)) {
                foreach($data_bag as $k => $v) {
                    $success_message[$k] = $v;
                }
            } else $success_message['data'] = $data_bag;

            return ($this->success) ?
                new JsonResponse($success_message) :
                \response()->json(['message' => $this->custom_message ? $this->custom_message : $error_message], 409);
        }
    }


?>