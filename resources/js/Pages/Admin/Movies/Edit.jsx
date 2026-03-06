import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Film, Upload, Info, Image as ImageIcon, Video, CheckCircle2, Loader2, Save } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Edit({ movie, categories }) {
    const posterInput = useRef();
    const [posterPreview, setPosterPreview] = useState(movie.poster ? `/storage/${movie.poster}` : null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        category_id: movie.category_id || '',
        title: movie.title || '',
        description: movie.description || '',
        genres: movie.genres || '',
        country: movie.country || '',
        year: movie.year || new Date().getFullYear(),
        language: movie.language || "O'zbekcha",
        duration: movie.duration || '',
        age_limit: movie.age_limit || '',
        poster: null,
        is_premium: movie.is_premium || false,
        price: movie.price || 0,
    });

    const handlePosterSelect = (e) => {
        const file = e.target.files[0];
        setData('poster', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPosterPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.movies.update', movie.id));
    };

    return (
        <AdminLayout>
            <Head title="Filmni Tahrirlash" />

            <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.movies.index')}
                        className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white group"
                    >
                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Filmni <span className="text-indigo-500">Tahrirlash</span></h1>
                        <p className="text-white/40 font-medium mt-1">Film ma'lumotlarini yangilang</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Poster Upload */}
                    <div className="space-y-6">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-6">
                            <h3 className="flex items-center gap-3 text-lg font-bold">
                                <ImageIcon className="h-5 w-5 text-indigo-500" />
                                Kino Posteri
                            </h3>

                            <div
                                onClick={() => posterInput.current.click()}
                                className="aspect-[2/3] w-full rounded-3xl bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative group cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all overflow-hidden"
                            >
                                {posterPreview ? (
                                    <>
                                        <img src={posterPreview} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-sm font-black tracking-widest uppercase">Rasmni O'zgartirish</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-6">
                                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="h-8 w-8 text-white/20" />
                                        </div>
                                        <p className="text-white/60 font-bold mb-1">Posterni Yuklash</p>
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">JPG, PNG 2MB gacha</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" hidden ref={posterInput} onChange={handlePosterSelect} accept="image/*" />
                            {errors.poster && <p className="text-red-400 text-xs font-bold mt-2 ml-2 tracking-wide uppercase">{errors.poster}</p>}
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-6">
                            <h3 className="flex items-center gap-3 text-lg font-bold text-white/40">
                                <Video className="h-5 w-5" />
                                Video Manbasi
                            </h3>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/60">Video Yuklangan</p>
                                    <p className="text-[10px] text-white/20 mt-0.5">Editda videoni o'zgartirib bo'lmaydi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Movie Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 space-y-10">
                            <h3 className="flex items-center gap-3 text-2xl font-black italic uppercase tracking-tighter">
                                <Info className="h-6 w-6 text-indigo-500" />
                                Film <span className="text-indigo-500">Tafsilotlari</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Sarlavha</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/10"
                                    />
                                    {errors.title && <p className="text-red-400 text-xs font-bold mt-2 ml-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Kategoriya</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Kategoriyani Tanlang</option>
                                        {categories.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name}</option>)}
                                    </select>
                                    {errors.category_id && <p className="text-red-400 text-xs font-bold mt-2 ml-1">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Yil</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={e => setData('year', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Janrlar</label>
                                    <input
                                        type="text"
                                        value={data.genres}
                                        onChange={e => setData('genres', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Davlat</label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={e => setData('country', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Til</label>
                                    <input
                                        type="text"
                                        value={data.language}
                                        onChange={e => setData('language', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Davomiyligi</label>
                                    <input
                                        type="text"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Yoshing chegarasi</label>
                                    <input
                                        type="text"
                                        value={data.age_limit}
                                        onChange={e => setData('age_limit', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold uppercase tracking-tight">Premium Kino</p>
                                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Ko'rish uchun obuna talab qilinadi</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_premium', !data.is_premium)}
                                            className={`h-7 w-12 rounded-full transition-all relative ${data.is_premium ? 'bg-indigo-600' : 'bg-white/10'}`}
                                        >
                                            <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${data.is_premium ? 'left-6' : 'left-1'}`}></div>
                                        </button>
                                    </div>

                                    {data.is_premium && (
                                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 block ml-1">Narxi (Ixtiyoriy)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={data.price}
                                                    onChange={e => setData('price', e.target.value)}
                                                    className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-widest pointer-events-none">SO'M</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Tavsif</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="4"
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex justify-end gap-6">
                                <Link href={route('admin.movies.index')} className="px-10 py-5 rounded-2xl font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest text-xs">Bekor Qilish</Link>
                                <button
                                    disabled={processing}
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] active:scale-[0.98] text-white px-12 py-5 rounded-2xl font-black tracking-widest uppercase text-xs transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-3"
                                >
                                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
