import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

/////////////////////////////////////
import { LoadItem, DeptData, PageProps, Version } from "@/types";

/////////////////
import { HeaderPanel } from "./Partials/HeaderPanel";
import { DataUploadCard } from "./Partials/DataUploadCard";
import { STVersionsCard } from "./Partials/STVersionsCard";
import { CalculationCard } from "./Partials/CalculationCard";
import { TotalLoadCard } from "./Partials/TotalLoadCard";
import { DeptTable } from "./Partials/DeptTable";
import { LoadEditorCard } from "./Partials/LoadEditorCard";
import { ResultFixationCard } from "./Partials/ResultFixationCard";


export default function Index(
    {
        auth,
    }:
        {
            auth: PageProps['auth'];
        }) {

    return (
        <AuthenticatedLayout>
            <Head title="Пользователи" />
            <LoadAndModifyModule />
        </AuthenticatedLayout>
    );
}

const LoadAndModifyModule: React.FC = () => {

    const handleFormsUpload = () => {
        console.log("handleFormsUpload not implemented yet");
    };

    const handleMatrixUpload = () => {
        console.log("handleMatrixUpload not implemented yet");
    };

    const handleShrUpload = () => {
        console.log("handleShrUpload not implemented yet");
    };

    const saveShrVersion = () => {
        console.log("saveShrVersion not implemented yet");
    };

    const applyShrVersion = () => {
        console.log("applyShrVersion not implemented yet");
    };

    const printProtocol = () => {
        console.log("printProtocol not implemented yet");
    };

    const recalcAndRender = () => {
        console.log("recalcAndRender not implemented yet");
    };

    const loadDemoData = () => {
        console.log("loadDemoData not implemented yet");
    };

    const toggleEditMode = () => {
        console.log("toggleEditMode not implemented yet");
    };

    const resetPendingChanges = () => {
        console.log("resetPendingChanges not implemented yet");
    };

    const applyPendingChanges = () => {
        console.log("applyPendingChanges not implemented yet");
    };

    const moveStaff = () => {
        console.log("moveStaff not implemented yet");
    };

    // ! should be dynamically generated
    const loads: LoadItem[] = [
        { id: "all", label: "По Управлению", value: 123456, percent: 75, color: "bg-green-500" },
        { id: "ekb", label: "Екатеринбург", value: 65432, percent: 60, color: "bg-yellow-500" },
        { id: "krg", label: "Курган", value: 58000, percent: 25, color: "bg-blue-500" },
    ];

    // ! should be dynamically generated

    const departments: DeptData[] = [
        {
            id: "dept_1155",
            name: "Отдел региональных счетов и балансов",
            territory: "ekb",
            territoryLabel: "Екатеринбург",
            staff: 1,
            totalLoad: 21.9,
            avgLoad: 22,
            levelPercent: 1,
            levelClass: "low",
            forms: [
                { id: "f_0602001_1008", form: "11", indicators: 30, reports: 1, coeff: 0.29, calc: 8.6 },
                { id: "f_0602002_1009", form: "11 (краткая)", indicators: 28, reports: 1, coeff: 0.29, calc: 8.0 },
                { id: "f_0602003_1010", form: "11 (сделка)", indicators: 11, reports: 1, coeff: 0.24, calc: 2.6 },
                { id: "f_0602004_1011", form: "11- НА", indicators: 11, reports: 1, coeff: 0.24, calc: 2.6 },
            ],
        },
        {
            id: "dept_1158",
            name: "Отдел статистики предприятий",
            territory: "ekb",
            territoryLabel: "Екатеринбург",
            staff: 1,
            totalLoad: 950.6,
            avgLoad: 951,
            levelPercent: 43,
            levelClass: "medium",
            forms: [
                { id: "f_0603001_1012", form: "20", indicators: 300, reports: 5, coeff: 0.32, calc: 96 },
                { id: "f_0603002_1013", form: "21", indicators: 200, reports: 3, coeff: 0.35, calc: 70 },
                { id: "f_0603003_1014", form: "22", indicators: 150, reports: 2, coeff: 0.30, calc: 45 },
            ],
        },
        {
            id: "dept_1161",
            name: "Отдел статистики строительства, инвестиций и ЖКХ",
            territory: "ekb",
            territoryLabel: "Екатеринбург",
            staff: 1,
            totalLoad: 2208.9,
            avgLoad: 2209,
            levelPercent: 100,
            levelClass: "high",
            forms: [
                { id: "f_0604001_1015", form: "30", indicators: 500, reports: 10, coeff: 0.40, calc: 200 },
                { id: "f_0604002_1016", form: "31", indicators: 300, reports: 5, coeff: 0.45, calc: 135 },
                { id: "f_0604003_1017", form: "32", indicators: 100, reports: 2, coeff: 0.50, calc: 50 },
                { id: "f_0604004_1018", form: "33", indicators: 50, reports: 1, coeff: 0.48, calc: 24 },
            ],
        },
        {
            id: "dept_1173",
            name: "Сектор статистики строительства, инвестиций и ЖКХ",
            territory: "kg",
            territoryLabel: "Курган",
            staff: 9,
            totalLoad: 1917.4,
            avgLoad: 213,
            levelPercent: 87,
            levelClass: "high",
            forms: [
                { id: "f_0605001_1019", form: "40", indicators: 200, reports: 4, coeff: 0.50, calc: 100 },
                { id: "f_0605002_1020", form: "41", indicators: 150, reports: 3, coeff: 0.48, calc: 72 },
                { id: "f_0605003_1021", form: "42", indicators: 100, reports: 2, coeff: 0.46, calc: 46 },
                { id: "f_0605004_1022", form: "43", indicators: 50, reports: 1, coeff: 0.45, calc: 23 },
            ],
        },
    ];


    // ! should be dynamically generated
    const versions: Version[] = [
        { name: "Штатное расписание v1.0", date: "01/03/2026" },
        { name: "Штатное расписание v1.1", date: "05/03/2026" },
        { name: "Штатное расписание v1.2", date: "10/03/2026" },
        { name: "Штатное расписание v2.0", date: "12/03/2026" },
        { name: "Штатное расписание v2.1", date: "13/03/2026" },
        { name: "Штатное расписание v2.2", date: "14/03/2026" },
        { name: "Штатное расписание v2.3", date: "15/03/2026" },
        { name: "Штатное расписание v3.0", date: "16/03/2026" },
        { name: "Штатное расписание v3.1", date: "17/03/2026" },
        { name: "Штатное расписание v3.2", date: "18/03/2026" },
        { name: "Штатное расписание v3.3", date: "19/03/2026" },
        { name: "Штатное расписание v4.0", date: "20/03/2026" },
        { name: "Штатное расписание v4.1", date: "21/03/2026" },
        { name: "Штатное расписание v4.2", date: "22/03/2026" },
    ];

    return (
        <div className="relative overflow-x-auto">
            <div className="container mx-auto p-3 space-y-3">
                <HeaderPanel />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <DataUploadCard />
                    <STVersionsCard
                        versions={versions}
                        applyShrVersion={applyShrVersion}
                        printProtocol={printProtocol}
                    />
                    <CalculationCard
                        recalcAndRender={recalcAndRender}
                        loadDemoData={loadDemoData}
                    />
                    <TotalLoadCard
                        loads={loads}
                        printProtocol={printProtocol}
                    />
                </div>

                <DeptTable
                    departments={departments}
                    toggleEditMode={() => console.log("edit mode")}
                    printProtocol={() => console.log("protocol")}
                    openDeptDetail={(id) => console.log("open dept", id)}
                    changeStaff={(id, value) => console.log("change staff", id, value)}
                />

                <LoadEditorCard
                    resetPendingChanges={resetPendingChanges}
                    applyPendingChanges={applyPendingChanges}
                    moveStaff={moveStaff}
                />

                <ResultFixationCard
                    saveShrVersion={saveShrVersion}
                    printProtocol={printProtocol}
                />
            </div>
        </div>
    );
};