<?php

namespace App\Policies;

use App\Models\User;
use App\Enum\RolesEnum;

class UserPolicy
{
    public function assignRoles(User $authUser, $_, array $roles): bool
    {
        if (in_array(RolesEnum::Root->value, $roles))
            return false;
        if (!$authUser->hasRole(RolesEnum::Root->value) && in_array(RolesEnum::Admin->value, $roles))
            return false;
        return true;
    }

    public function updateAccess(User $authUser, User $editableUser): bool
    {
        $authIsRoot = $authUser->hasRole(RolesEnum::Root->value);
        $authIsAdmin = $authUser->hasRole(RolesEnum::Admin->value);
        $isAdminPage = $editableUser->hasRole(RolesEnum::Admin->value);

        if ($editableUser->hasRole(RolesEnum::Root->value)) {
            return false;
        }
        //no root, no admin? go away
        if (!$authIsAdmin && !$authIsRoot) {
            return false;
        }
        //only root can manage admins
        if ($authIsAdmin && $isAdminPage) {
            return false;
        }
        return true;
    }

    public function editAccess(User $authUser, User $editableUser): bool
    {
        $authIsRoot = $authUser->hasRole(RolesEnum::Root->value);
        $authIsAdmin = $authUser->hasRole(RolesEnum::Admin->value);
        $isAdminPage = $editableUser->hasRole(RolesEnum::Admin->value);

        //can't go to root edit page
        if ($editableUser->hasRole(RolesEnum::Root->value)) {
            return false;
        }
        //only root or admins can go here
        if (!$authIsAdmin && !$authIsRoot) {
            return false;
        }
        //admins cannot go to admins edit
        if ($authIsAdmin && $isAdminPage) {
            return false;
        }

        return true;
    }
}
