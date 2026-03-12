import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/custom/InputError';
import InputLabel from '@/components/custom/InputLabel';
import { Button } from '@/components/ui/button';
import TextInput from '@/components/custom/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className='bg-black/20 backdrop-blur-sm fixed inset-0 z-0' onClick={close}></div>
            <form onSubmit={submit} className='z-50 relative border-2 px-6 py-10 border-gray-800'>
                <div className='rounded-none'>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full text-white"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Пароль" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full text-white"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>


                <div className="mt-4 w-full flex items-center justify-end">
                    <Button className="w-full" disabled={processing} variant="white">
                        Войти
                    </Button>
                </div>
            </form>
        </GuestLayout >
    );
}
