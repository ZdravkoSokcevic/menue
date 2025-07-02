<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repository\TableRepository;

class TablesController extends Controller
{
    private TableRepository $tableRepository;

    public function __construct(TableRepositoryInterafce $t) 
    {
        $this->tableRepository = $t;
    }

    public function index()
    {
        
    }
}
