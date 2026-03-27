import InputError from '@/components/custom/InputError';
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
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Вход" />

            {/* Background gradient */}
            <div className='bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 fixed inset-0 z-0'></div>

            {/* Login Form - Centered, no scroll */}
            <div className='fixed inset-0 flex items-center justify-center z-10'>
                <form onSubmit={submit} className='w-full max-w-md bg-white/80 backdrop-blur-sm border border-indigo-200/50'>
                    {/* Form Body - No header */}
                    <div className='p-8 space-y-6'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className='block font-mono text-[11px] font-bold text-indigo-600 tracking-wider mb-2 uppercase'>
                                EMAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className='w-full border border-indigo-200/50 bg-indigo-50/30 px-3 py-2.5 font-mono text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 transition-colors'
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <p className='text-[10px] font-mono font-bold text-rose-600 mt-2 tracking-wider'>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className='block font-mono text-[11px] font-bold text-indigo-600 tracking-wider mb-2 uppercase'>
                                ПАРОЛЬ
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className='w-full border border-indigo-200/50 bg-indigo-50/30 px-3 py-2.5 font-mono text-[12px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 transition-colors'
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <p className='text-[10px] font-mono font-bold text-rose-600 mt-2 tracking-wider'>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className='w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 cursor-pointer text-[11px] font-mono font-bold tracking-wider transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {processing ? "ВХОД..." : "ВОЙТИ"}
                        </button>

                        {/* Forgot Password Link */}
                        {canResetPassword && (
                            <div className='text-center pt-2'>
                                <Link
                                    href={route('password.request')}
                                    className='font-mono text-[10px] text-indigo-600 hover:text-indigo-700 tracking-wider uppercase transition-colors'
                                >
                                    ЗАБЫЛИ ПАРОЛЬ?
                                </Link>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}