import { StateUploadButton } from "./Partials/StateUploadButton";
import { AddDepartmentButton } from "./Partials/AddDepartmentButton";

interface StateEmptyActionsProps {
    onAddDepartment: () => void;
}

export function StateEmptyActions({
    onAddDepartment,
}: StateEmptyActionsProps) {
    return (
        <div className="flex min-h-125 flex-col items-center justify-center">
            <p className="mt-36 text-xl text-gray-400 uppercase">
                ШТАТНОЕ РАСПИСАНИЕ ПУСТО
            </p>

            <div className="flex items-center justify-center gap-12">
                <StateUploadButton route_path="state.upload" isPlaceholder />

                <div className="h-60 w-px bg-[#3949AB]/30" />

                <AddDepartmentButton
                    onClick={onAddDepartment}
                />
            </div>
        </div>
    );
}