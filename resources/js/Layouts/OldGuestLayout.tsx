import ApplicationLogo from '@/components/custom/ApplicationLogo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from '@inertiajs/react';
import NavLink from '@/components/custom/NavLink';
import ResponsiveNavLink from '@/components/custom/ResponsiveNavLink';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ToggleDarkMode } from '@/components/custom/ToggleDarkMode';
import { AuthProvider } from '@/Contexts/AuthContext';
import { AuthDropdown } from '@/Pages/Auth/AuthDropdown';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';


export default function Guest({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingMainDropdown, setShowingMainDropdown] = useState(false);

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-transparent">
                <nav className=" bg-white dark:bg-transparent">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">

                            {/* <NavButtonsMenu /> */}
                            <div className="flex flex-col" >
                                <div className="flex justify-center shrink-0 items-center h-full">
                                    <Link href="/">
                                        <ApplicationLogo />
                                    </Link>
                                    <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                        <div className="flex w-full items-center justify-center space-x-2">
                                            <NavLink
                                                href="#"
                                                active={false}
                                                className="bg-primary px-4 py-2"
                                            >
                                                Проект
                                            </NavLink>

                                            <NavLink
                                                href="#"
                                                active={false}
                                                className="bg-primary px-4 py-2"
                                            >
                                                Обучение
                                            </NavLink>

                                            <NavLink
                                                href="#"
                                                active={false}
                                                className="bg-primary px-4 py-2"
                                            >
                                                Чек-лист
                                            </NavLink>

                                            <div className="-me-2 flex items-center">
                                                <button
                                                    onClick={() => setShowingMainDropdown(prev => !prev)}
                                                    className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-white/20 hover:text-gray-500 focus:bg-white/20 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:text-gray-400 dark:focus:text-gray-400"
                                                >
                                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                                        <path
                                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M4 6h16M4 12h16M4 18h16"
                                                        />
                                                        <path
                                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className={`${showingMainDropdown && 'absolute inset-0 top-0 bottom-o left-0 right-0'}`} onClick={() => { setShowingMainDropdown(false) }}></div>

                                            <div className={`${showingMainDropdown ? 'flex absolute px-2 py-10 top-14 dark:backdrop-blur-sm dark:bg-transparent bg-white dark:border-white border-black border-2' : 'hidden'}`}>
                                                <NavLink
                                                    href="#"
                                                    active={false}
                                                    className="bg-primary px-4 py-2"
                                                >
                                                    Общественная жизнь
                                                </NavLink>

                                                <NavLink
                                                    href="#"
                                                    active={false}
                                                    className="bg-primary px-4 py-2"
                                                >
                                                    Команда
                                                </NavLink>

                                                <NavLink
                                                    href="#"
                                                    active={false}
                                                    className="bg-primary px-4 py-2"
                                                >
                                                    Диагностика
                                                </NavLink>

                                                <NavLink
                                                    href="#"
                                                    active={false}
                                                    className="bg-primary px-4 py-2"
                                                >
                                                    Проектный офис
                                                </NavLink>

                                                <NavLink
                                                    href="#"
                                                    active={false}
                                                    className="bg-primary px-4 py-2"
                                                >
                                                    Новости
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center gap-14">
                                <ToggleDarkMode />
                                <AuthDropdown />
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Responsive menu */}
                    <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink href={route('doc.create')} active={route().current('doc.create')}>
                                CreateDoc
                            </ResponsiveNavLink>
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink
                                    as="button"
                                    method="get"
                                    href={route('login')}
                                >
                                    Log In
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white dark:bg-gray-800">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                <main className="flex justify-center items-center mt-10 sm:mt-20">
                    <div className="w-full max-w-md bg-white px-6 py-4 rounded-lg dark:bg-gray-800">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
