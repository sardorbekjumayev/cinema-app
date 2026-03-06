import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ChevronLeft, Upload, Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        image: null,
        url: '',
        position: 'home_top',
        is_active: true,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.ads.store'));
    };

    return (
        <AdminLayout>
            <Head title="Admin - Reklama Yaratish" />

            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <Link href={route('admin.ads.index')} className="inline-flex items-center text-sm font-semibold text-white/40 hover:text-indigo-400 transition-colors mb-4">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Reklamalarga Qaytish
                        </Link>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Yangi <span className="text-indigo-500">Reklama</span> Yaratish</h1>
                        <p className="text-white/40 font-medium mt-2 text-lg">Reklama xabaringizni loyihalashtiring va maqsad qiling.</p>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
                    <form onSubmit={submit} className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-3">Reklama Sarlavhasi</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/10"
                                        placeholder="Masalan: Yozgi Sotuv 2026"
                                    />
                                    {errors.title && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-3">Yo'nalish URL (Ixtiyoriy)</label>
                                    <input
                                        type="url"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/10"
                                        placeholder="https://misol.uz"
                                    />
                                    {errors.url && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.url}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-3">Joylashuv</label>
                                        <select
                                            value={data.position}
                                            onChange={(e) => setData('position', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="home_top">Asosiy Yuqori Banner</option>
                                            <option value="sidebar">Yon Panel Reklamasi</option>
                                            <option value="movie_page">Kino Sahifasi</option>
                                        </select>
                                        {errors.position && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.position}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-3">Holat</label>
                                        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setData('is_active', true)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${data.is_active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-white/40 hover:text-white/60'}`}
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Faol
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('is_active', false)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!data.is_active ? 'bg-white/10 text-white/60 shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                                            >
                                                <EyeOff className="h-3.5 w-3.5" />
                                                Yashirin
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <label className="block text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-3">Reklama Rasmi</label>
                                <div className="relative aspect-[16/9] w-full bg-white/5 border-2 border-dashed border-white/10 rounded-[32px] overflow-hidden group">
                                    {preview ? (
                                        <>
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-indigo-500 hover:text-white transition-all">
                                                    Rasmni O'zgartirish
                                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                                            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <Upload className="h-8 w-8 text-white/20" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Reklama Rasmini Yuklash</span>
                                            <span className="mt-2 text-[8px] text-white/20 uppercase font-black tracking-[0.2em]">Tavsiya etiladi: Banner uchun 1200x400</span>
                                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                                {errors.image && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.image}</p>}
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/5 flex justify-end gap-6">
                            <Link
                                href={route('admin.ads.index')}
                                className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/5 hover:text-white transition-all"
                            >
                                Bekor Qilish
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 border border-transparent rounded-2xl font-black text-[10px] text-white uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] focus:outline-none transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Kampaniyani Chop Etish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
