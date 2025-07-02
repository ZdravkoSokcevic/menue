<?php 
	namespace App\Http\Repositories;

	use Illuminate\Http\Request;
	use App\Interfaces\TableRepositoryInterface;
	use App\Interfaces\CompanyRepositoryInterface;
	use App\Models\Table;
	use App\Models\Company;
	use Illuminate\Database\Collection;

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
			return false;
		}
		return $this->company::create($data);
	}

	public function edit($id, $data) 
	{

	}

	public function delete($id)
	{

	}

	public function all(): Collection 
	{
		return Company::all();
	}
}