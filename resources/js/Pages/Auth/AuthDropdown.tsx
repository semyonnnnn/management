import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/Contexts/AuthContext";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function AuthDropdown() {
    const { registerOrLogin, setRegisterOrLogin } = useAuthContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleAuthClick = (type: 'login' | 'register') => {
        setRegisterOrLogin(type);
        setDialogOpen(true);
        setDropdownOpen(false); // Close dropdown when opening dialog
    };

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                        Гость
                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Button
                            className="w-full flex justify-start"
                            variant="dropdownItem"
                            onClick={() => handleAuthClick('login')}
                        >
                            Войти
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Button
                            variant="dropdownItem"
                            onClick={() => handleAuthClick('register')}
                        >
                            Зарегистрироваться
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-106.25 dark:bg-gray-800 dark:text-white">
                    {registerOrLogin === 'login' && <LoginForm />}
                    {registerOrLogin === 'register' && <RegisterForm />}
                </DialogContent>
            </Dialog>
        </>
    );
}