// types.ts
import type { FormDataErrors } from '@inertiajs/core';
import { Config } from 'ziggy-js';

export type registerOrLoginType = {
    userId: number | null;
    email: string;
    token: string;
} | null;

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    permissions: string[];
    roles: string[];
}

interface BackendDepartment {
    id: number | string;
    name: string;
    workload: number | string;
    staff: number | string;
    territory: 'ekb' | 'krg';
    forms?: any[];
}

interface StaffFormData {
    staff_map: Record<string, number>;
    version: string;
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

export interface LoadItem {
    id: string;
    percent: number;
    label: string;
    value: number | string;
    load_per_person: number;
}

export interface TotalLoadCardProps {
    loads: LoadItem[];
}
export interface DeptData {
    id: string;
    name: string;
    territory: string;
    dataTerritory: 'ekb' | 'krg';
    staff: number;
    state: number;
    totalLoad: number;
    avgLoad: number;
    levelPercent: number;
    levelClass: 'low' | 'medium' | 'high';
    forms: DeptForm[];
}

interface DeptForm {
    id: string;
    name: string;
    indicators: number;
    reports: number;
    coeff: number;
    final: number;
}

export interface DeptTableProps {
    departments: DeptData[];
    toggleEditMode: () => void;
    changeStaff: (id: string, value: number) => void;
}

interface ModalDetailsProps {
    fixedOptimalLoad: number;
    showModal: boolean;
    setShowModal: (v: boolean) => void;
    departmentName: string;
    territory: string;
    staffCount: number;
    totalLoad: number;
    loadPerStaff: number;
    forms: any[];
    levelPercent: number; // NEW
    levelClass: 'low' | 'medium' | 'high'; // NEW
}

export interface ModalDetailsProps {
    showModal: boolean;
    setShowModal: (val: boolean) => void;
    departmentName: string;
    territory: string;
    staffCount: number;
    totalLoad: number;
    loadPerStaff: number;
    forms: FormData[];
}

interface FormData {
    id: string;
    name: string;
    indicators: number;
    reports: number;
    coeff: number;
    final: number;
}

export interface Version {
    name: string;
    date: string;
}

export interface STVersionsCardProps {
    applyShrVersion: () => void;
    printProtocol: () => void;
    versions: Version[];
}

export interface Department {
    id: string;
    name: string;
    territory: string;
    staff: number;
    workload: number;
    state?: number;
    [key: string]: any;
}

export interface StatisticalForm {
    id: number;
    name: string;
    indicators: number;
    reports: number;
    coeff: string;
    old_department_id?: string | number;
    resolvedDeptName?: string;
    resolvedTerritory?: string;
    [key: string]: any;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedForms {
    data: StatisticalForm[];
    links: PaginationLink[];
    total: number;
    current_page: number;
}

export interface Department {
    id: string;
    name: string;
    territory: string;
}

interface AddFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    versionId: number;
}
interface ExtendedPageProps extends PageProps {
    departments: Department[];
    forms: PaginatedForms;
    versionId: number;
    filters: {
        territory?: string;
        search?: string;
    };
}
export interface Department {
    id: string;
    code: string;
    name: string;
    state: string;
    territory: 'ekb' | 'krg';
}

export interface DepartmentRowProps {
    dept: Department;
    index: number;
    setData: (
        key: string,
        action: (prev: Department[]) => Department[],
    ) => void;
    onDelete: (dept: Department) => void;
}
