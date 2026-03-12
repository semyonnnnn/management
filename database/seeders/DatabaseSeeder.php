<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;
///
use App\Models\User;
use App\Enum\RolesEnum;
use App\Enum\PermissionsEnum;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $rootRole = Role::create(['name' => RolesEnum::Root->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);
        $senseiRole = Role::create(['name' => RolesEnum::Sensei->value]);
        $gakuseiRole = Role::create(['name' => RolesEnum::Gakusei->value]);

        $manageAdminsPermission = Permission::create([
            'name' => PermissionsEnum::ManageAdmins->value,
        ]);
        $manageUsersPermission = Permission::create([
            'name' => PermissionsEnum::ManageUsers->value,
        ]);
        $assignTasksPermission = Permission::create([
            'name' => PermissionsEnum::AssignTasks->value,
        ]);
        $completeTasksPermission = Permission::create([
            'name' => PermissionsEnum::CompleteTasks->value,
        ]);

        $rootRole->syncPermissions([
            $manageUsersPermission,
            $manageAdminsPermission
        ]);
        $adminRole->syncPermissions([
            $manageUsersPermission,
        ]);
        $senseiRole->syncPermissions([
            $assignTasksPermission
        ]);
        $gakuseiRole->syncPermissions([
            $completeTasksPermission
        ]);

        User::factory()->create([
            'name' => 'Root',
            'email' => 'root@root.com',
            'password' => 'root',
        ])->assignRole(RolesEnum::Root);
    }
}
