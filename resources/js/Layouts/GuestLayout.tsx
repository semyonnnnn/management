import DesktopNav from '@/components/custom/DesktopNav';
import MobileNav from '@/components/custom/MobileNav';
import ApplicationLogo from '@/components/custom/ApplicationLogo';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ToggleDarkMode } from '@/components/custom/ToggleDarkMode';
import { AuthProvider } from '@/Contexts/AuthContext';
import { AuthDropdown } from '@/Pages/Auth/AuthDropdown';

export default function GuestLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingMainDropdown, setShowingMainDropdown] = useState(false);

    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-transparent">
                <nav className="bg-white dark:bg-transparent">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Logo + Desktop Menu */}
                            <div className="flex flex-col">
                                <div className="flex justify-center shrink-0 items-center h-full">
                                    <Link href="/">
                                        <ApplicationLogo />
                                    </Link>
                                    <DesktopNav
                                        showingMainDropdown={showingMainDropdown}
                                        setShowingMainDropdown={setShowingMainDropdown}
                                        showingNavigationDropdown={showingNavigationDropdown}
                                    />
                                </div>
                            </div>

                            {/* Dark mode + auth dropdown */}
                            <div className="hidden sm:flex sm:items-center gap-14">
                                <ToggleDarkMode />
                                <AuthDropdown />
                            </div>

                            {/* Mobile menu button */}
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

                    {/* Mobile menu */}
                    <MobileNav showingNavigationDropdown={showingNavigationDropdown} />
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
