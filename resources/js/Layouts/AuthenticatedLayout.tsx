import ApplicationLogo from '@/components/custom/ApplicationLogo';
import { router, Link, usePage } from '@inertiajs/react';
import ResponsiveNavLink from '@/components/custom/ResponsiveNavLink';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
// Import the font weights you need
import "@fontsource/jetbrains-mono/400.css"; // regular
import "@fontsource/jetbrains-mono/700.css"; // bold


export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingMainDropdown, setShowingMainDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-transparent" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <nav className="bg-white border-b border-gray-600 text-[#f3ffca] font-headline tracking-tighter uppercase">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">

                        {/* Logo (kept exactly as in your HTML design) */}
                        <div className="flex flex-col">
                            <div className="flex justify-center shrink-0 items-center h-full">
                                <Link href="/main">
                                    <ApplicationLogo />
                                </Link>
                            </div>
                        </div>

                        {/* Right controls (status, account, sign-out) */}
                        <div className="hidden sm:flex sm:items-center gap-6">

                            {/* User Block */}
                            <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-low ghost-border bg-black">
                                <AccountCircleOutlinedIcon className="text-[#00eefc]" />

                                <span
                                    className="font-mono text-[10px] text-gray-300 tracking-widest"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {user.name}
                                </span>
                            </div>


                            {/* Sign Out Button */}
                            <button
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                className="
            px-4 py-2
            bg-white text-black
            border
            cursor-pointer
            text-sm tracking-widest
            transition-all duration-300
            hover:bg-black
            hover:text-white
            hover:border-white
            border-black
        "
                            >
                                выйти
                            </button>

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

                {/* Responsive menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                as="button"
                                method="post"
                                href={route('logout')}
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            {/* {header && (
                <header className="bg-white dark:bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )} */}

            <main>{children}</main>
        </div>
    );
}
