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
