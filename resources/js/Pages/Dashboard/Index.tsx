import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

import { HeaderPanel } from "./Partials/HeaderPanel";
import { DataUploadCard } from "./Partials/DataUploadCard";
import { SRVersionsCard } from "./Partials/SRVersionsCard";
import { CalculationCard } from "./Partials/CalculationCard";
import { TotalLoadCard } from "./Partials/TotalLoadCard";
import { DeptTable } from "./Partials/DeptTable";
import { LoadEditorCard } from "./Partials/LoadEditorCard";
import { ResultFixationCard } from "./Partials/ResultFixationCard";

/////////////////////////////////////

import { LoadItem } from "@/types";

export default function Index(
    {
        auth,
    }:
        {
            auth: PageProps['auth'];
        }) {

    return (
        <AuthenticatedLayout header={<>prikol</>}>
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

    const loads: LoadItem[] = [
        { id: "all", label: "По Управлению", value: 123456, percent: 75, color: "bg-green-500" },
        { id: "ekb", label: "Екатеринбург", value: 65432, percent: 60, color: "bg-yellow-500" },
        { id: "krg", label: "Курган", value: 58000, percent: 40, color: "bg-blue-500" },
    ];

    return (
        <div className="relative overflow-x-auto">
            <div className="container mx-auto p-3 space-y-3">
                <HeaderPanel />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <DataUploadCard
                        handleFormsUpload={handleFormsUpload}
                        handleMatrixUpload={handleMatrixUpload}
                        handleShrUpload={handleShrUpload}
                        saveShrVersion={saveShrVersion}
                    />
                    <SRVersionsCard
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
                    toggleEditMode={toggleEditMode}
                    printProtocol={printProtocol}
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