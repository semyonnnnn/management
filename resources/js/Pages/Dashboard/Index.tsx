import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { User, PageProps } from "@/types";
import { can } from "@/helpers";


export default function Index(
    {
        auth,
    }:
        {
            auth: PageProps['auth'];
        }) {

    const canEdit = (auth.user?.roles[0]?.toLocaleLowerCase() === 'root' ||
        auth.user?.roles[0]?.toLocaleLowerCase() === 'admin');

    return (
        <AuthenticatedLayout>
            <Head title="Пользователи" />

            <div className="relative overflow-x-auto">
            </div>
        </AuthenticatedLayout>
    );
}

const Row = ({ user, auth_user, canEdit, roleLabels, isCommon }: {
    user: User;
    auth_user: User;
    canEdit: boolean;
    roleLabels: Record<string, string>;
    isCommon: boolean;
}) => {
    const user_role = user?.roles[0]?.toLocaleLowerCase();
    const auth_role = auth_user?.roles[0]?.toLocaleLowerCase();

    const admins_do_not_edit_admins = (auth_role == 'admin' && user_role === 'admin') ? false : true;

    return (
        <tr
            className="border-b bg-[#303030] border-gray-700"
        >
            <th
                scope="row"
                className="px-6 py-4 font-medium whitespace-nowrap text-white"
            >
                {user.name}
            </th>
            <td className="px-6 py-4 text-[#bebebe]">{user.email}</td>
            {!isCommon && <td className="px-6 py-4 text-[#bebebe]">{user.created_at}</td>}
            <td className="px-6 py-4 text-[#bebebe]">
                {roleLabels[user?.roles[0]]}
            </td>

            <td className="px-6 py-4 text-[#bebebe]">
                {canEdit && admins_do_not_edit_admins &&
                    <Link
                        href={route("user.edit", user.id)}
                        className="text-accent-main"
                    >
                        Редактировать
                    </Link>}
            </td>
        </tr>
    );
}