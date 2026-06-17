// RelatedUsers.tsx
import { User, RelatedUsersType, MultipleListProps, RadioListProps } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import Radio from "@/components/custom/Radio";

export const RelatedUsers = ({
    whoAmI,
    related_users,
    ours,
    data,
    handleCheckboxes,
    handleRadio,
    errors,
    selectedRole
}: RelatedUsersType) => {
    const role = selectedRole.toLowerCase();

    const gakuseis: (User & { sensei?: User })[] = related_users?.gakuseis ?? [];
    const senseis: (User & { gakuseis?: User[] })[] = related_users?.senseis ?? [];
    const oursArray: User[] = ours ?? [];

    if (role === "admin") return null;
    return (
        <div className="mb-8">
            {role === "sensei" &&
                gakuseis.map(user => {
                    if (user.id == whoAmI.id) {
                        return;
                    }
                    // if (user)
                    const disabled =
                        !ours?.some(a => a.id === user.id) && user.sensei !== null;

                    const isChecked = data.related_users.some(u => u.id === user.id);

                    return (
                        <MultipleList
                            disabled={disabled}
                            key={user.id}
                            user={user}
                            checked={isChecked}
                            onChange={handleCheckboxes}
                        />
                    );
                })}

            {role === "gakusei" &&
                senseis.map(user => {
                    if (user.id == whoAmI.id) {
                        return;
                    }
                    const selectedUserId = data.related_users[0]?.id ?? oursArray[0]?.id ?? null;
                    const isChecked = user.id === selectedUserId;

                    return (
                        <RadioList
                            key={user.id}
                            user={user}
                            checked={isChecked}
                            onChange={handleRadio}
                        />
                    );
                })}

            <span className="text-red-500">{errors.related_users}</span>
        </div>
    );
};

const MultipleList = ({ user, checked, disabled, onChange }: MultipleListProps) => {
    return (
        <label className={`flex select-none items-center mb-1 opacity-80 ${disabled ? 'text-gray-600 line-through' : ''}`}>
            <Checkbox
                checked={!!checked}
                onCheckedChange={(value) => onChange(!!value, user)}
                disabled={disabled}
            />
            <span className="ms-2 text-sm">{user.name}</span>
            {user.sensei && <span className="ml-5">{' в группе ' + user.sensei.name}</span>}
        </label>
    );
};

const RadioList = ({ user, checked, onChange }: RadioListProps) => {
    return (
        <label className="select-none items-center mb-1 cursor-pointer">
            <Radio
                checked={!!checked}
                onChange={() => onChange(user)}
                className="self-start"
            />
            <span className="ms-2 text-sm text-gray-400">{user.name}</span>
            {user.gakuseis && user.gakuseis.length > 0 && (
                <ul className="ml-5 text-sm text-gray-500 list-disc">
                    {user.gakuseis.map(g => (
                        <li key={g.id}>{g.name}</li>
                    ))}
                </ul>
            )}
        </label>
    );
};