<?php 
	namespace App\Http\Repositories;

	use Illuminate\Http\Request;
	use App\Interfaces\TableRepositoryInterface;
	use App\Interfaces\CompanyRepositoryInterface;
	use App\Models\Table;
	use App\Models\Company;
	use Illuminate\Database\Eloquent\Collection;
	use Illuminate\Validation\ValidationException;

class CompanyRepository implements CompanyRepositoryInterface 
{
	private Company $company;
	public function __construct() {
		$this->company = new Company();
	}
	public function create($data)
	{
		$exists = Company::whereLike('name', '%' . $data['name'] . '%')->first();
		if($exists) {
			return ['success' => false, 'message' => 'Company exists'];
		}
		return $this->company::create($data);
	}

	public function edit($id, $data) 
	{
		$company = Company::find($id);
		$this->company = $company;
		return $this->company->update($data);
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
		return Company::all();
	}
}