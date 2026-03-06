import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function Index({ categories }) {
    const [isAdding, setIsAdding] = useState(false);
    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
    });

    const [editingId, setEditingId] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('admin.categories.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                }
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => {
                    setIsAdding(false);
                    reset();
                }
            });
        }
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setData('name', category.name);
    };

    return (
        <AdminLayout>
            <Head title="Kategoriyalarni Boshqarish" />

            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Kino Kategoriyalari</h1>
                        <p className="text-white/40 font-medium mt-1">Kinolarni to'plamlarga ajrating</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                        Kategoriya Qo'shish
                    </button>
                </div>

                {/* Add/Edit Form Overlay */}
                {(isAdding || editingId) && (
                    <div className="mb-10 bg-[#0a0a0a] border border-indigo-500/30 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingId ? 'Kategoriyani Yangilash' : 'Yangi Kategoriya Yaratish'}</h3>
                            <button onClick={() => { setIsAdding(false); setEditingId(null); reset(); }} className="text-white/40 hover:text-white">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Masalan: Jangari, Drama, Fantastika"
                                    className="w-full bg-white/5 border-white/10 rounded-xl px-5 py-3.5 text-white placeholder-white/20 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    autoFocus
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-2 ml-1">{errors.name}</p>}
                            </div>
                            <button
                                disabled={processing}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {editingId ? 'O\'zgarishlarni Saqlash' : 'Kategoriya Yaratish'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Categories Table/List */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-5 px-8 text-white/40 text-xs font-bold uppercase tracking-widest">Nomi</th>
                                <th className="text-left py-5 px-8 text-white/40 text-xs font-bold uppercase tracking-widest">Slug</th>
                                <th className="text-right py-5 px-8 text-white/40 text-xs font-bold uppercase tracking-widest">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-8">
                                        <span className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{category.name}</span>
                                    </td>
                                    <td className="py-5 px-8">
                                        <code className="bg-white/5 px-3 py-1 rounded-lg text-indigo-300 text-sm font-medium">{category.slug}</code>
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(category)}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => { if (confirm('Ishonchingiz komilmi?')) destroy(route('admin.categories.destroy', category.id)) }}
                                                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="py-20 text-center text-white/20 italic font-medium">Kategoriyalar topilmadi. Birinchi kategoriya yaratishdan boshlang!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
