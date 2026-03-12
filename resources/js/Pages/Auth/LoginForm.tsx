import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import TextInput from '@/components/custom/TextInput';
import InputError from '@/components/custom/InputError';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthContext } from "@/Contexts/AuthContext";



export function LoginForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });
    const { registerOrLogin, setRegisterOrLogin } = useAuthContext();
    const [loginProps, setLoginProps] = useState<{ status?: string; canResetPassword: boolean; } | null>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(
            route('login'), {
            onFinish: () => reset('password'),
        }
        );
    };
    return (
        <form onSubmit={submit}>
            <DialogHeader className="mb-8">
                <DialogTitle>Вход</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
                <div className="grid gap-3">
                    <Label htmlFor="email-1">Почта</Label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="password-1">Пароль</Label>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>
            </div>
            <DialogFooter>
                <div className="w-full flex justify-between items-center mt-4">
                    <div className="block">
                        <label className="flex items-center select-none cursor-pointer">
                            <Checkbox
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData('remember', Boolean(checked))
                                }
                            />

                            <span className="ms-2 block text-sm text-gray-600 dark:text-gray-400">
                                Запомнить меня
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end">
                        {loginProps?.canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <Button type="submit" disabled={processing} variant="default">
                            Войти
                        </Button>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            setRegisterOrLogin('register');
                        }}>
                            Нет Аккаунта?
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </form>
    )
}
