import { Button } from '@/components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import React from 'react';
import { DocForm } from "@/Pages/CreateDoc/Partials/DocForm";

export default function CreateDoc() {
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.post('/doc.create', formData);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    + документ
                </h2>
            }
        >
            <Head title="+ документ" />
            <div className='flex w-full items-center justify-center my-10'>
                <DocForm />
            </div>
        </AuthenticatedLayout>
    );
}
