import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect, useMemo } from "react";
import { DeptData, PageProps, LoadItem } from "@/types";
import { TotalLoadCard } from "./Partials/TotalLoadCard";
import { DeptTable } from "./Partials/DeptTable";
import Modal from "@/components/custom/Modal";

export default function Index({ auth, departments, forms }: PageProps & { departments: any[], forms: any[] }) {
    return (
        <AuthenticatedLayout
            // user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Управление нагрузкой</h2>}
        >
            <Head title="Отделы" />
            <LoadAndModifyModule backendDepartments={departments} forms={forms} />
        </AuthenticatedLayout>
    );
}

const LoadAndModifyModule: React.FC<{ backendDepartments: any[], forms: any[] }> = ({ backendDepartments, forms }) => {
    const [localStaff, setLocalStaff] = useState<Record<string, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const staticDepartments = backendDepartments;

    // const everyone = backendDepartments.reduce((acc, dep) => acc + dep.staff, 0);

    const { data, setData, post, processing } = useForm({
        staff_map: {} as Record<string, number>,
        version: "",
    });

    useEffect(() => {
        const initial = backendDepartments.reduce((acc, d) => {
            acc[String(d.id)] = Number(d.staff);
            return acc;
        }, {} as Record<string, number>);
        setLocalStaff(initial);
        setData('staff_map', initial);
    }, [backendDepartments]);

    // THE FIXED ANCHOR: Derived from initial DB state to keep the 100% mark static
    const fixedOptimalLoad = useMemo(() => {
        const totalWorkload = backendDepartments.reduce((acc, d) => acc + Number(d.workload), 0);
        const totalStaff = backendDepartments.reduce((acc, d) => acc + Number(d.staff), 0);
        return totalStaff > 0 ? totalWorkload / totalStaff : 0;
    }, [backendDepartments]);

    // Calculate Card Data: Mapping "Optimal" to 50% visual width
    const loads: LoadItem[] = useMemo(() => {
        const getStats = (territoryKey?: string) => {
            const depts = territoryKey
                ? backendDepartments.filter(d => d.territory === territoryKey)
                : backendDepartments;

            const workload = depts.reduce((acc, d) => acc + Number(d.workload), 0);
            const staff = depts.reduce((acc, d) => acc + (localStaff[String(d.id)] ?? Number(d.staff)), 0);
            const avg = staff > 0 ? workload / staff : 0;

            // Map: (avg / benchmark) * 50. If avg == benchmark, percent is 50 (The Center).
            const percent = fixedOptimalLoad > 0 ? Math.round((avg / fixedOptimalLoad) * 50) : 0;
            return { workload, percent };
        };

        const global = getStats();
        const ekb = getStats('ekb');
        const krg = getStats('krg');

        return [
            { id: "all", label: "По Управлению", value: Math.round(global.workload), percent: global.percent },
            { id: "ekb", label: "Екатеринбург", value: Math.round(ekb.workload), percent: ekb.percent },
            { id: "krg", label: "Курган", value: Math.round(krg.workload), percent: krg.percent },
        ];
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    const processedDepartments: DeptData[] = useMemo(() => {
        return backendDepartments.map((dept) => {
            const staff = localStaff[String(dept.id)] ?? Number(dept.staff);
            const avgLoad = staff > 0 ? Number(dept.workload) / staff : 0;
            const levelPercent = fixedOptimalLoad > 0 ? Math.round((avgLoad / fixedOptimalLoad) * 50) : 0;

            return {
                ...dept,
                id: String(dept.id),
                staff,
                totalLoad: Number(dept.workload),
                avgLoad: Math.round(avgLoad),
                levelPercent,
            };
        });
    }, [backendDepartments, localStaff, fixedOptimalLoad]);

    const changeStaff = (id: string, value: number) => {
        const updated = { ...localStaff, [id]: Math.max(0, value) };
        setLocalStaff(updated);
        setData('staff_map', updated);
    };

    const handleConfirmSave = () => {
        router.post(route('versions.create'), {
            name: data.version,
            staff_map: data.staff_map,
            version: data.version,
        });
    };

    const hasChanges = backendDepartments.some(d => localStaff[String(d.id)] !== Number(d.staff));

    return (
        <div className="container mx-auto p-3 space-y-6 pb-32">
            <TotalLoadCard loads={loads} />

            <div className="bg-blue-50  flex gap-5">
                <p className="text-blue-700 border-l-4 border-blue-500 text-sm font-bold  p-4 uppercase tracking-wider">
                    Нагрузка на человека: {Math.round(fixedOptimalLoad).toLocaleString()}
                </p>
            </div>

            <DeptTable
                staticDepartments={staticDepartments}
                departments={processedDepartments}
                changeStaff={changeStaff}
                fixedOptimalLoad={fixedOptimalLoad}
                toggleEditMode={() => { }}
            />

            {hasChanges && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
                    <div className="bg-white/90 backdrop-blur-md border border-indigo-200 p-2 shadow-2xl flex gap-2">
                        <button
                            onClick={() => {
                                const initial = backendDepartments.reduce((acc, d) => {
                                    acc[String(d.id)] = Number(d.staff);
                                    return acc;
                                }, {} as Record<string, number>);
                                setLocalStaff(initial);
                                setData('staff_map', initial);
                            }}
                            className="px-8 py-4 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-600 font-mono font-bold text-xl"
                        >
                            СБРОСИТЬ
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-10 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-mono font-bold text-xl uppercase hover:opacity-90"
                        >
                            ПРИМЕНИТЬ
                        </button>
                    </div>
                </div>
            )}

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm">
                <div className="bg-white border border-indigo-200/50 h-fit flex flex-col p-6">
                    <h3 className="text-2xl font-mono font-bold text-gray-900 mb-6">сохранение_версии</h3>
                    <input
                        type="text"
                        value={data.version}
                        onChange={(e) => setData('version', e.target.value)}
                        placeholder="Напр. v1.0.4"
                        className="w-full bg-indigo-50 border border-indigo-100 p-4 font-mono text-lg mb-4 outline-none"
                    />
                    <div className="flex gap-3">
                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-indigo-200 font-mono font-bold text-indigo-600 uppercase">ОТМЕНА</button>
                        <button
                            onClick={() => { handleConfirmSave(); setIsModalOpen(false); }}
                            className="flex-1 py-4 bg-indigo-600 text-white font-mono font-bold uppercase"
                        >
                            ОК
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};