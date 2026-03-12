import { FormEventHandler, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputLabel from "@/components/custom/InputLabel";
import TextInput from "@/components/custom/TextInput";
import InputError from "@/components/custom/InputError";
import PrimaryButton from "@/components/custom/PrimaryButton";
import Radio from "@/components/custom/Radio";
import { User, Role, PageProps } from "@/types";
import { RelatedUsers } from "./RelatedUsers";

export default function Edit({
  roles,
  user,
  roleLabels,
  auth,
  related_users,
  ours,
}: {
  roles: Role[];
  user: User;
  roleLabels: Record<string, string>;
  auth: PageProps["auth"];
  related_users?: { gakuseis: User[]; senseis: User[] };
  ours?: User[];
}) {
  const isAdmin = auth.user.roles[0].toLowerCase() === "admin";
  const { data, setData, processing, errors, put } = useForm({
    name: user.name,
    email: user.email,
    roles: user.roles,
    related_users: ours ?? [],
  });
  const [selectedRole, setSelectedRole] = useState(data.roles[0]);

  const roles_no_root = isAdmin
    ? roles.filter(
      role =>
        role.name.toLowerCase() !== "root" &&
        role.name.toLowerCase() !== "admin"
    )
    : roles.filter(role => role.name.toLowerCase() !== "root");

  const updateUser: FormEventHandler = ev => {
    ev.preventDefault();
    put(route("user.update", user.id), { preserveScroll: true });
  };

  const onRoleChange = (ev: any) => {
    if (ev.target.checked) {
      setData("roles", [ev.target.value]);
      setSelectedRole(ev.target.value);
    }
  };
  const handleCheckboxes = (checked: boolean, user: User) => {
    setData(prev => ({
      ...prev,
      related_users: checked
        ? [...prev.related_users, user]
        : prev.related_users.filter(u => u.id !== user.id)
    }));
  };

  const handleRadio = (user: User) => {
    setData("related_users", [user]);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-200 w-[40%] mx-auto">
          Редактировать <b>"{user.name}"</b>
        </h2>
      }
    >
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
                onChange={e => setData("name", e.target.value)}
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
                onChange={e => setData("email", e.target.value)}
              />
              <InputError className="mt-2" message={errors.email} />
            </div>

            <div className="mb-8">
              <InputLabel value="Роль" />
              {roles_no_root.map(role => (
                <label className="flex select-none items-center mb-1" key={role.id}>
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

            <RelatedUsers
              whoAmI={user}
              related_users={related_users}
              ours={ours}
              data={data}
              handleCheckboxes={handleCheckboxes}
              handleRadio={handleRadio}
              errors={errors}
              selectedRole={selectedRole}
            />

            <div className="flex items-center gap-4">
              <PrimaryButton disabled={processing} className="w-full">
                Сохранить
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}