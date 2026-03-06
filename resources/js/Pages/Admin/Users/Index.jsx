import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, router } from '@inertiajs/react';
import { Users, Shield, UserX, UserCheck, Trash2, Mail, BadgeCheck } from 'lucide-react';
import { useState } from 'react';

export default function Index({ users }) {
    const [processing, setProcessing] = useState(null);

    const handleUpdate = (id, role, status) => {
        setProcessing(id);
        router.put(route('admin.users.update', id), { role, status }, {
            onFinish: () => setProcessing(null)
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pro': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'premium': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    const getRoleColor = (role) => {
        return role === 'admin' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-white/40 bg-white/5 border-white/10';
    };

    return (
        <AdminLayout>
            <Head title="Foydalanuvchilarni Boshqarish" />

            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Foydalanuvchilar <span className="text-indigo-500">Boshqaruvi</span></h1>
                        <p className="text-white/40 font-medium mt-1">Kirish darajalarini nazorat qiling va hamjamiyat a'zolarini boshqaring</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                            <Users className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/20">Jami Foydalanuvchilar</p>
                            <p className="text-xl font-bold">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-white/20">Ism va Email</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                                    <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-white/20">Rol</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-white/20">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/40 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter">{user.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Mail className="h-3 w-3 text-white/20" />
                                                        <p className="text-xs font-medium text-white/20 lowercase tracking-wide">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleUpdate(user.id, user.role, e.target.value)}
                                                    className={`appearance-none bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-4 py-2 cursor-pointer focus:ring-2 focus:ring-indigo-500/50 transition-all text-center ${getStatusColor(user.status)}`}
                                                >
                                                    <option value="basic" className="bg-[#121212]">Oddiy (Basic)</option>
                                                    <option value="premium" className="bg-[#121212]">Premium</option>
                                                    <option value="pro" className="bg-[#121212]">Pro</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleUpdate(user.id, e.target.value, user.status)}
                                                    className={`appearance-none bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-4 py-2 cursor-pointer focus:ring-2 focus:ring-indigo-500/50 transition-all text-center ${getRoleColor(user.role)}`}
                                                >
                                                    <option value="user" className="bg-[#121212]">Foydalanuvchi</option>
                                                    <option value="admin" className="bg-[#121212]">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="h-10 w-10 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
