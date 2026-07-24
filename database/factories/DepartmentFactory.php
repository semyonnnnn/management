<?php
namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    public function definition(): array
    {
        return [
            'name' => 'Отдел ' . $this->faker->unique()->numerify('###'),
            'code' => $this->faker->unique()->numerify('##'),
            'territory' => $this->faker->randomElement(['ekb', 'krg']),
            'staff' => $this->faker->numberBetween(5, 50),
            'state' => $this->faker->numberBetween(0, 5),
            'okveds' => '',
            'workload' => $this->faker->numberBetween(10, 100),
        ];
    }
}