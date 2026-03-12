import ResponsiveNavLink from '@/components/custom/ResponsiveNavLink';
import { useAuthContext } from "@/Contexts/AuthContext";

interface MobileMenuProps {
    showingNavigationDropdown: boolean;
}




export default function MobileNav({ showingNavigationDropdown }: MobileMenuProps) {
    const { registerOrLogin, setRegisterOrLogin } = useAuthContext();

    const handleAuthClick = (type: 'login' | 'register') => {
        setRegisterOrLogin(type);
    };

    return (
        <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
            <div className="space-y-1 pb-3 pt-2">
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Проект</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Обучение</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Чек-лист</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Общественная жизнь</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Команда</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Диагностика</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Проектный офис</ResponsiveNavLink>
                <ResponsiveNavLink href="#" active={false} className="bg-primary px-4 py-2">Новости</ResponsiveNavLink>
            </div>

            <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                <div className="mt-3 space-y-1">
                    <ResponsiveNavLink
                        as="button" method="get" onClick={() => handleAuthClick('register')}
                    >
                        Зарегистрироваться
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        as="button" method="get" onClick={() => handleAuthClick('login')}
                    >
                        Войти
                    </ResponsiveNavLink>
                </div>
            </div>
        </div>
    );
}
