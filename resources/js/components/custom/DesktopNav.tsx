import NavLink from '@/components/custom/NavLink';
import { Dispatch, SetStateAction } from 'react';

interface DesktopMenuProps {
    showingMainDropdown: boolean;
    setShowingMainDropdown: Dispatch<SetStateAction<boolean>>;
    showingNavigationDropdown: boolean;
}

export default function DesktopNav({ showingMainDropdown, setShowingMainDropdown, showingNavigationDropdown }: DesktopMenuProps) {
    return (
        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
            <div className="flex w-full items-center justify-center space-x-2">
                <NavLink href="#" active={false} className="bg-primary px-4 py-2">Проект</NavLink>
                <NavLink href="#" active={false} className="bg-primary px-4 py-2">Обучение</NavLink>
                <NavLink href="#" active={false} className="bg-primary px-4 py-2">Чек-лист</NavLink>

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

                {/* Main dropdown */}
                <div className={`${showingMainDropdown ? 'flex absolute px-2 py-10 top-14 dark:backdrop-blur-sm dark:bg-transparent bg-white dark:border-white border-black border-2' : 'hidden'}`}>
                    <NavLink href="#" active={false} className="bg-primary px-4 py-2">Общественная жизнь</NavLink>
                    <NavLink href="#" active={false} className="bg-primary px-4 py-2">Команда</NavLink>
                    <NavLink href="#" active={false} className="bg-primary px-4 py-2">Диагностика</NavLink>
                    <NavLink href="#" active={false} className="bg-primary px-4 py-2">Проектный офис</NavLink>
                    <NavLink href="#" active={false} className="bg-primary px-4 py-2">Новости</NavLink>
                </div>
            </div>
        </div>
    );
}
