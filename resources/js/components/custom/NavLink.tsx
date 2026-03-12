import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                ("bg-transparent text-black hover:bg-accent hover:text-accent-foreground cursor-pointer dark:text-white dark:bg-transparent dark:backdrop-blur-sm  dark:hover:bg-white/20" + " "
                    + className)
            }
        >
            {children}
        </Link>
    );
}
