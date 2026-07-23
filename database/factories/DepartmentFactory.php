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
            'name' => 'Отдел ' . $this->faker->unique()->word(),
            'code' => $this->faker->unique()->numerify('DEP-###'),
            'territory' => $this->faker->randomElement(['ekb', 'krg']),
            'staff' => $this->faker->numberBetween(5, 50),
            'state' => $this->faker->numberBetween(0, 5),
            'okveds' => collect(['12', '13', '14', '15', '16', '17', '20', '21'])
                ->random($this->faker->numberBetween(1, 4))
                ->implode(', '),
            'workload' => $this->faker->numberBetween(10, 100),
        ];
    }
}