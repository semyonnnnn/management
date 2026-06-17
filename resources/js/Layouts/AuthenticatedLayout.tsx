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
    const { url } = usePage();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingMainDropdown, setShowingMainDropdown] = useState(false);

    // Function to check if a route is active
    const isActive = (routePath: string) => {
        if (routePath === 'main.index' && (url === '/' || url === '/main')) {
            return true;
        }
        if (routePath === 'uploadFiles.get' && url.includes('/upload')) {
            return true;
        }
        if (routePath === 'versions.get' && url.includes('/versions')) {
            return true;
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <nav className="bg-white/80 backdrop-blur-sm border-b border-indigo-200/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">

                        {/* Logo */}
                        <div className="flex flex-col">
                            <div className="flex justify-center shrink-0 items-center h-full">
                                <Link href="/main">
                                    <ApplicationLogo />
                                </Link>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className='flex gap-5'>
                            <div
                                className={`cursor-pointer px-3 py-1 text-sm font-mono font-bold tracking-wider transition-all duration-200 ${isActive('main.index')
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-900 border-b-2 border-transparent hover:border-indigo-500'
                                    }`}
                                onClick={() => router.get(route('main.index'))}
                            >
                                ГЛАВНАЯ
                            </div>
                            <div
                                className={`cursor-pointer px-3 py-1 text-sm font-mono font-bold tracking-wider transition-all duration-200 ${isActive('uploadFiles.get')
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-900 border-b-2 border-transparent hover:border-indigo-500'
                                    }`}
                                onClick={() => router.get(route('uploadFiles.get'))}
                            >
                                ЗАГРУЗИТЬ
                            </div>
                            <div
                                className={`cursor-pointer px-3 py-1 text-sm font-mono font-bold tracking-wider transition-all duration-200 ${isActive('versions.get')
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-900 border-b-2 border-transparent hover:border-indigo-500'
                                    }`}
                                onClick={() => router.get(route('versions.get'))}
                            >
                                ВЕРСИИ
                            </div>
                        </div>

                        {/* Right controls */}
                        <div className="hidden sm:flex sm:items-center gap-4">

                            {/* User Block - Sharp edges style */}
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-400/30">
                                <AccountCircleOutlinedIcon className="text-white text-lg" />
                                <span className="font-mono text-[11px] text-white tracking-wider font-bold">
                                    {user.name.toUpperCase()}
                                </span>
                            </div>

                            {/* Sign Out Button - Modern sharp style */}
                            <button
                                onClick={() => router.post(route('logout'))}
                                className="
                                    px-5 py-2
                                    bg-white text-gray-900
                                    border border-gray-300
                                    cursor-pointer
                                    text-[11px] font-mono font-bold tracking-wider
                                    transition-all duration-200
                                    hover:bg-gray-900 hover:text-white hover:border-gray-900
                                "
                            >
                                ВЫЙТИ
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-indigo-600 transition duration-150 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 focus:bg-indigo-100 focus:text-indigo-700"
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

                {/* Responsive mobile menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className="border-t border-indigo-200/50 pb-1 pt-4 bg-white/80 backdrop-blur-sm">
                        <div className="px-4">
                            <div className="text-sm font-mono font-bold text-gray-900 tracking-wider uppercase">
                                {user.name}
                            </div>
                            <div className="text-[10px] font-mono text-indigo-500 mt-1">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                as="button"
                                method="post"
                                href={route('logout')}
                                className="text-[11px] font-mono font-bold tracking-wider"
                            >
                                ВЫЙТИ
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="p-6">{children}</main>
        </div>
    );
}