<?php

namespace Database\Factories;

use App\Models\Form;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormFactory extends Factory
{
    protected $model = Form::class;

    public function definition(): array
    {
        return [
            'okud' => $this->faker->unique()->numberBetween(1000000, 9999999),
            'name' => 'Форма отчетности № ' . $this->faker->unique()->numerify('###'),
            'period' => $this->faker->randomElement(['годовая', 'полугодовая', 'квартальная', 'месячная']),
            'indicators' => $this->faker->numberBetween(5, 50),
            'k1' => $this->faker->randomFloat(2, 0.5, 2.0),
            'k2' => $this->faker->randomFloat(2, 0.5, 2.0),
            'k3' => $this->faker->randomFloat(2, 0.5, 2.0),
            'k4' => $this->faker->randomFloat(2, 0.5, 2.0),
            'k5' => $this->faker->randomFloat(2, 0.5, 2.0),
            'k6' => $this->faker->randomFloat(2, 0.5, 2.0),
            'is_consolidated' => $this->faker->boolean(20),
        ];
    }
}