import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Film, Clock, Globe, Languages, Users, Trash2, Edit2, RefreshCcw, Star } from 'lucide-react';

export default function Index({ movies, categories }) {
    const { delete: destroy } = useForm();

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'processing': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 animate-pulse';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-white/5 text-white/40 border-white/10';
        }
    };

    return (
        <AdminLayout>
            <Head title="Kino Kutubxonasi" />

            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Kino <span className="text-indigo-500">Kutubxonasi</span></h1>
                        <p className="text-white/40 font-medium mt-2 text-lg">Kollektsiyangizni va transkodlash vazifalarini boshqaring</p>
                    </div>
                    <Link
                        href={route('admin.movies.create')}
                        className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] active:scale-[0.98] text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-sm transition-all shadow-xl shadow-indigo-600/30"
                    >
                        <Plus className="h-5 w-5" />
                        Yangi film yuklash
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {movies.map((movie) => (
                        <div key={movie.id} className="bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
                            {/* Poster area */}
                            <div className="aspect-[16/9] relative overflow-hidden bg-[#111]">
                                {movie.poster ? (
                                    <img src={`/storage/${movie.poster}`} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10">
                                        <Film className="h-20 w-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                                <div className="absolute top-6 left-6 flex gap-2">
                                    <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase backdrop-blur-md ${getStatusStyle(movie.status)}`}>
                                        {movie.status === 'completed' ? 'Tayyor' : (movie.status === 'processing' ? 'Ishlanmoqda' : (movie.status === 'pending' ? 'Kutilmoqda' : 'Xato'))}
                                    </span>
                                    {movie.is_premium && (
                                        <span className="px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-500 border border-amber-500/30 text-[10px] font-black tracking-widest uppercase flex items-center gap-2 shadow-xl shadow-amber-500/20">
                                            <Star className="h-3 w-3 fill-amber-500" />
                                            Premium
                                        </span>
                                    )}
                                    {movie.category && (
                                        <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 text-[10px] font-black tracking-widest uppercase">
                                            {movie.category.name}
                                        </span>
                                    )}
                                </div>

                                <div className="absolute bottom-6 left-8 right-8">
                                    <h3 className="text-2xl font-black text-white leading-tight line-clamp-2 transition-transform duration-500 group-hover:-translate-y-1">{movie.title}</h3>
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="p-8 space-y-6 flex-1 flex flex-col">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 text-white/40">
                                        <Clock className="h-4 w-4 text-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{movie.duration || 'Mavjud emas'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/40">
                                        <Globe className="h-4 w-4 text-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{movie.country || 'Mavjud emas'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/40">
                                        <Languages className="h-4 w-4 text-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{movie.language || 'Mavjud emas'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/40">
                                        <Users className="h-4 w-4 text-indigo-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{movie.age_limit || 'Mavjud emas'}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 mt-auto flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('admin.movies.edit', movie.id)}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-indigo-600 transition-all group/btn shadow-lg"
                                        >
                                            <Edit2 className="h-5 w-5 text-white/60 group-hover/btn:text-white" />
                                        </Link>
                                        <button
                                            onClick={() => { if (confirm('Ushbu filmni o\'chirishni xohlaysizmi?')) destroy(route('admin.movies.destroy', movie.id)) }}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-red-500 transition-all group/btn shadow-lg"
                                        >
                                            <Trash2 className="h-5 w-5 text-white/60 group-hover/btn:text-white" />
                                        </button>
                                    </div>

                                    {movie.status !== 'completed' && (
                                        <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 hover:text-indigo-300 tracking-widest uppercase transition-colors">
                                            <RefreshCcw className="h-3 w-3" />
                                            Qayta yuklash
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {movies.length === 0 && (
                    <div className="py-40 text-center flex flex-col items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center">
                            <Film className="h-12 w-12 text-white/20" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white/60">Filmlar topilmadi</h3>
                            <p className="text-white/20 max-w-sm mx-auto mt-2">Sizning kutubxonangiz hozircha bo'sh. Birinchi blokbasterni yuklash vaqti keldi!</p>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
