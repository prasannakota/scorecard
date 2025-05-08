<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use Illuminate\Support\Str;

class DepartmentSeeder extends Seeder
{
    public function run()
    {
        $departments = [
            [
                'name' => 'Sales & Marketing',
                'description' => 'Assessments related to sales and marketing performance',
                'is_active' => true
            ],
            [
                'name' => 'Customer Service',
                'description' => 'Assessments related to customer service and support',
                'is_active' => true
            ],
            [
                'name' => 'Operations',
                'description' => 'Assessments related to operational efficiency',
                'is_active' => true
            ],
            [
                'name' => 'Finance',
                'description' => 'Assessments related to financial performance',
                'is_active' => true
            ],
            [
                'name' => 'Human Resources',
                'description' => 'Assessments related to HR and people management',
                'is_active' => true
            ]
        ];

        foreach ($departments as $department) {
            Department::create([
                'name' => $department['name'],
                'description' => $department['description'],
                'is_active' => $department['is_active']
            ]);
        }
    }
}
