<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
///////////////////////////////////////
use App\Models\User;
use App\Enum\RolesEnum;
use App\Http\Resources\AuthUserResource;

class UserListService
{
    public function edit(User $user)
    {
        $users = User::all();

        $gakuseis = $users->filter(
            function ($u) {
                return $u->hasRole(RolesEnum::Gakusei->value);
            }
        )->map(function ($gakusei) {

            return [
                'id' => $gakusei->id,
                'name' => $gakusei->name,
                'sensei' => $gakusei->sensei()->exists()
                    ? $gakusei->sensei()->first()->only(['id', 'name'])
                    : null,
            ];
        })->values();

        $senseis = $users->filter(
            function ($u) {
                return $u->hasRole(RolesEnum::Sensei->value);
            }
        )->map(function ($sensei) {

            return [
                'id' => $sensei->id,
                'name' => $sensei->name,
                'gakuseis' => $sensei->gakusei()->get()->map(fn($g) => [
                    'id' => $g->id,
                    'name' => $g->name,
                ])->values(),
            ];
        })->values();

        $isSensei = $user->hasRole(RolesEnum::Sensei->value);
        $isGakusei = $user->hasRole(RolesEnum::Gakusei->value);

        if ($isSensei) {
            $ours = $user->gakusei()->get()->map(fn($g) => [
                'id' => $g->id,
                'name' => $g->name,
            ])->values();
        } elseif ($isGakusei) {
            $ours = $user->sensei()->get()->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
            ])->values();
        } else {
            $ours = collect();
        }

        return [
            'related_users' => [
                'gakuseis' => $gakuseis,
                'senseis' => $senseis,
            ],
            'ours' => $ours,
        ];
    }

    public function update(array $related_users, User $user, string $requestedRole)
    {
        $isSensei = $user->hasRole(RolesEnum::Sensei->value);
        $isGakusei = $user->hasRole(RolesEnum::Gakusei->value);

        if (!$isSensei && !$isGakusei) {
            return;
        }

        $requestedIds = collect($related_users)->pluck('id')->filter()->values();

        if ($isSensei) {
            if (!$user->hasRole($requestedRole)) {
                $user->gakusei()->detach();
                return;
            }


            $forbidden = User::whereIn('id', $requestedIds)
                ->whereHas('sensei', fn($q) => $q->where('users.id', '!=', $user->id))
                ->whereNotIn('id', $user->gakusei()->pluck('users.id'))
                ->pluck('id');

            if ($forbidden->isNotEmpty()) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'related_users' => 'У некоторых учеников уже есть наставники'
                ]);
            }

            $user->gakusei()->detach();

            if ($requestedIds->isNotEmpty()) {
                $user->gakusei()->attach($requestedIds);
            }

        } else if ($isGakusei) {
            if (!$user->hasRole($requestedRole)) {
                $user->sensei()->detach();
                return;
            }
            $user->sensei()->detach();
            $user->sensei()->attach($requestedIds[0] ?? null);
            $user->sensei()->sync($requestedIds[0] ?? null);
        }
    }

}