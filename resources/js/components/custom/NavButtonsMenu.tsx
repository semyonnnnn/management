"use client"

import * as React from "react"

import { ToggleDarkMode } from '@/components/custom/ToggleDarkMode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import ApplicationLogo from "@/components/custom/ApplicationLogo";
import { Link } from "@inertiajs/react";

export function NavButtonsMenu() {
    return (
        <div className="flex justify-center w-full items-center px-10 mt-2 gap-4">
            <Link href="/">
                <ApplicationLogo />
            </Link>
            <div className="flex w-full items-center justify-center">
                <ButtonGroup>
                    <Button variant="main_menu">Проект</Button>
                    <Button variant="main_menu">Обучение</Button>
                    <Button variant="main_menu">Чек-лист</Button>
                    <Button variant="main_menu">Общественная жизнь</Button>
                    <Button variant="main_menu">Команда</Button>
                    <Button variant="main_menu">Диагностика</Button>
                    <Button variant="main_menu">Проектный офис</Button>
                    <Button variant="main_menu">Новости</Button>
                </ButtonGroup>
            </div>
            <ToggleDarkMode />
        </div>
    )
}
