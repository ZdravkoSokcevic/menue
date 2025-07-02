<?php 
	namespace App\Http\Traits;

	use Illuminate\Database\Eloquent\Model;
	use App\Models\Translation;
	use \LaravelLocalization;
	
	trait Translatable
	{
		public function __get($key)
		{
			if(isset($this->translatable) && in_array($key, $this->translatable))
			{
				return $this->getTranslation($key);
			}else return parent::__get($key);
		}

	    public function __set($key, $value)
	    {
	    if(isset($this->translatable) && in_array($key, $this->translatable))
	        {
	            //translate and return
	            $this->setTranslation($key,$value);
	        }
	        else
	        {        
	            parent::__set($key, $value);
	        }
	    }
	    public function trans($key,$locale)
	    {
	        return $this->getTranslation($key,$locale);
	    }

	    public function getTranslation( $key, $locale = NULL )
	    {
	        if(!$locale)
	        {
	            $locale = LaravelLocalization::getCurrentLocale();
	        }
	        //model class, model id, locale code
	        $translation = Translation::where("model_class",get_class($this))->where("model_id",$this->id)->where("key",$key)->where("locale",$locale)->first();        
	        if(!$translation)
	        {
	            return "";
	        }
	        else
	        {
	            return $translation->value;
	        }
	    }

	    public function setTranslation($key,$value,$locale = NULL)
	    {
	        if(!$locale)
	        {
	            $locale = LaravelLocalization::getCurrentLocale();
	        }
	        $translation = Translation::where("model_class",get_class($this))->where("model_id",$this->id)->where("key",$key)->where("locale",$locale)->first();       
	        if(!$translation)
	        {
	            $translation = new Translation;
	            $translation->model_class = get_class($this);
	            $translation->model_id = $this->id;
	            $translation->key = $key;
	            $translation->locale = $locale;
	            $translation->value = $value;
	        }
	        else
	        {
	            $translation->value = $value;
	        }        
	        
	        return $translation->save();
	    }

	    public function toJson($locale = NULL)
	    {
	        if(!$locale)
	        {
	            $locale = LaravelLocalization::getCurrentLocale();
	        }
	        $array = $this->toArray();
	        if(isset($this->translatable))
	        {
	            foreach($this->translatable as $value)
	            {
	                $array[$value] = $this->getTranslation($value,$locale);
	            }
	        }
	        return json_encode($array);
	    }
	}
?>