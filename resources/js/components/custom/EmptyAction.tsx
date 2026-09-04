import { StateUploadButton } from "@/components/custom/StateUploadButton";
import { AddButtonPlaceholder } from "@/components/custom/AddButtonPlaceholder";

interface EmptyActionsProps {
    onAddButtonClick: () => void;
    warning: string;
    route_path: string;
}

export function EmptyActions({
    onAddButtonClick,
    warning,
    route_path,
}: EmptyActionsProps) {
    return (
        <div className="flex min-h-125 flex-col items-center justify-center">
            <p className="mt-36 text-xl text-gray-400 uppercase">
                {warning}
            </p>

            <div className="flex items-center justify-center gap-12">
                <StateUploadButton route_path={route_path} isPlaceholder />

                <div className="h-60 w-px bg-[#3949AB]/30" />

                <AddButtonPlaceholder
                    onClick={onAddButtonClick}
                />
            </div>
        </div>
    );
}