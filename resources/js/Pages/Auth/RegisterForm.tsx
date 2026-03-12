import { Button } from "@/components/ui/button"
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import TextInput from '@/components/custom/TextInput';
import InputError from '@/components/custom/InputError';
import InputLabel from '@/components/custom/InputLabel';
import PrimaryButton from '@/components/custom/PrimaryButton';
import { useAuthContext } from "@/Contexts/AuthContext";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";



export function RegisterForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const { registerOrLogin, setRegisterOrLogin } = useAuthContext();
    const [loginProps, setLoginProps] = useState<{ status?: string; canResetPassword: boolean; } | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <form onSubmit={submit}>
            <DialogHeader className="mb-8">
                <DialogTitle>Регистрация</DialogTitle>
            </DialogHeader>
            <div>
                <InputLabel htmlFor="name" value="Имя" />

                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    isFocused={true}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />

                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="email" value="Почта" />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    required
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
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={(e) => setData('password', e.target.value)}
                    required
                />

                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel
                    htmlFor="password_confirmation"
                    value="Подтвердить пароль"
                />

                <TextInput
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full dark:text-white!"
                    autoComplete="new-password"
                    onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                    }
                    required
                />

                <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                />
            </div>

            <div className="mt-4 flex items-center justify-end" onClick={() => {
            }}>
                <Button disabled={processing}>
                    Зарегистрироваться
                </Button>

                <Button
                    onClick={async (e) => {
                        e.preventDefault();
                        setRegisterOrLogin('login');
                        const res = await fetch('/login');
                        const data = await res.json();
                        setLoginProps(data);
                    }}
                >
                    Есть аккаунт?
                </Button>
            </div>
        </form>
    )
}
