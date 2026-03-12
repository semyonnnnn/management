import { Head, useForm } from "@inertiajs/react";
import { User } from "@/types";
import InputLabel from "@/components/custom/InputLabel";
import TextInput from "@/components/custom/TextInput";
import InputError from "@/components/custom/InputError";
import { FormEventHandler } from "react";
import PrimaryButton from "@/components/custom/PrimaryButton";
import Radio from "@/components/custom/Radio";

export default function Edit({
    roles,
    user,
    roleLabels,
}: {
    roles: any;
    user: User;
    roleLabels: Record<string, string>;
}) {
    const { data, setData, processing, errors, put } = useForm({
        name: user.name,
        email: user.email,
        roles: user.roles,
    });

    const updateUser: FormEventHandler = (ev) => {
        ev.preventDefault();

        put(route("user.update", user.id), {
            preserveScroll: true,
        });
    };

    const onRoleChange = (ev: any) => {
        if (ev.target.checked) {
            setData("roles", [ev.target.value]);
        }
    };

    return (
        <>
            <Head title={user.name} />

            <div className="mb-4 overflow-hidden shadow-sm sm:rounded-lg bg-bg-main w-[40%] mx-auto">
                <div className="p-6 text-gray-100 flex gap-8">
                    <form onSubmit={updateUser} className="w-full">
                        <div className="mb-8">
                            <InputLabel htmlFor="name" value="Name" />

                            <TextInput
                                id="name"
                                disabled
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                isFocused
                                autoComplete="name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="mb-8">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                disabled
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="mb-8">
                            <InputLabel value="Role" />
                            {roles.map((role: any) => (
                                <label className="flex items-center mb-1" key={role.id}>
                                    <Radio
                                        name="roles"
                                        checked={data.roles.includes(role.name)}
                                        value={role.name}
                                        onChange={onRoleChange}
                                    />
                                    <span className="ms-2 text-sm text-gray-400 cursor-pointer">
                                        {roleLabels[role.name]}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing} className="w-full">
                                Сохранить
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
