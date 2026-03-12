// types.ts
import type { FormDataErrors } from '@inertiajs/core';
import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    permissions: string[];
    roles: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
};

export type RelatedUsersPayload = {
    gakuseis: (User & { sensei?: User })[];
    senseis: (User & { gakuseis?: User[] })[];
};

export type DataType = {
    name: string;
    email: string;
    roles: string[];
    related_users: User[];
};

export type RelatedUsersType = {
    related_users?: RelatedUsersPayload;
    ours?: User[];
    data: DataType;
    handleCheckboxes: (checked: boolean, user: User) => void;
    handleRadio: (user: User) => void;
    errors: FormDataErrors<{
        related_users: User[];
    }>;
    selectedRole: string;
    whoAmI: User;
};

export interface MultipleListProps {
    user: User & { sensei?: User };
    checked: boolean;
    disabled?: boolean;
    onChange: (checked: boolean, user: User) => void;
}

export interface RadioListProps {
    user: User & { gakuseis?: User[] };
    checked: boolean;
    onChange: (user: User) => void;
}
