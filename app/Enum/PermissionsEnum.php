<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case ManageAdmins = 'manageAdmins';
    case ManageUsers = 'manageUsers';
    case AssignTasks = 'assignTasks';
    case CompleteTasks = 'completeTasks';
}
