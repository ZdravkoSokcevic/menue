<?php 
	namespace App\Http\Repositories;

	use App\Models\Category;
	use Illuminate\Http\Request;
	use App\Interfaces\TableRepositoryInterface;
	use App\Interfaces\CompanyRepositoryInterface;
	use App\Models\Table;
	use App\Models\Company;
	use Illuminate\Database\Eloquent\Collection;
	use Illuminate\Validation\ValidationException;
	use Log;

class CompanyRepository implements CompanyRepositoryInterface 
{
	protected Company $company;
	public function __construct(Company $c) {
		$this->company = $c;
	}
	public function create($data)
	{
		$exists = Company::whereLike('name',  trim($data['name']))->first();
		if($exists) {
			return ['success' => false, 'message' => 'Company exists'];
		}
		// Log::info(json_encode(['data' => $data]));
		return $this->company::create($data);
	}

	public function createDefaultCategories(Company $c)
	{
		// dd($c->id);
		$default_categories = config('categories.default');
		// dd($default_categories);
		foreach($default_categories as &$category) {
			$category['company_id'] = $c->id;
		}

		Log::info(json_encode([ 'CompanyRepository:createDefaultCategories'=>$default_categories]));
		$success = Category::insert($default_categories);
		return $success;
	}

	public function edit($id, $data): Company | bool
	{
		$company = Company::find($id);
		$this->company = $company;
		if($this->company->update($data))
			return $this->company;
		else return false;
	}

	public function delete($id)
	{
		$company = Company::find($id);
		if($company) {

			$this->company = $company;
			return $this->company->delete();
		}else return false;
	}

	public function all(): Collection 
	{
		return Company::with(['license', 'currency', 'language', 'creator', 'admin'])->get();
	}
}