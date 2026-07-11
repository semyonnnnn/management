<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;
/////////////////////////
use App\Models\User;
use App\Enum\RolesEnum;
use App\Enum\PermissionsEnum;
use App\Models\Version;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create or get roles
        $rootRole = Role::firstOrCreate(['name' => RolesEnum::Root->value]);
        $adminRole = Role::firstOrCreate(['name' => RolesEnum::Admin->value]);

        // Create or get permissions
        $manageAdminsPermission = Permission::firstOrCreate([
            'name' => PermissionsEnum::ManageAdmins->value,
        ]);
        $manageUsersPermission = Permission::firstOrCreate([
            'name' => PermissionsEnum::ManageUsers->value,
        ]);
        $assignTasksPermission = Permission::firstOrCreate([
            'name' => PermissionsEnum::AssignTasks->value,
        ]);
        $completeTasksPermission = Permission::firstOrCreate([
            'name' => PermissionsEnum::CompleteTasks->value,
        ]);

        // Sync permissions (this won't affect other permissions that might exist)
        $rootRole->syncPermissions([
            $manageUsersPermission,
            $manageAdminsPermission
        ]);
        $adminRole->syncPermissions([
            $manageUsersPermission,
        ]);

        // Create users only if they don't exist
        if (!User::query()->where('email', 'boss@boss.com')->exists()) {
            User::factory()->create([
                'name' => 'VS',
                'email' => 'boss@boss.com',
                'password' => 'boss',
            ])->assignRole(RolesEnum::Root);
        }

        if (!User::query()->where('email', 'root@root.com')->exists()) {
            User::factory()->create([
                'name' => 'root',
                'email' => 'root@root.com',
                'password' => 'root',
            ])->assignRole(RolesEnum::Root);
        }

        Version::firstOrCreate(
            ['name' => 'start'],
            ['isCurrent' => true]
        );
    }
}