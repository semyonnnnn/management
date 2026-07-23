<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Form;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        Department::factory()->count(50)->create();
        Form::factory()->count(100)->create();
    }
}