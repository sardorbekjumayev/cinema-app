import { Head, Link, router } from '@inertiajs/react';
import { Search, Film, Star, Clock, Globe, ChevronRight, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdBanner from '@/Components/Cinema/AdBanner';

export default function Welcome({ auth, movies, categories, filters, ads }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeCategory, setActiveCategory] = useState(filters.category || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get('/', { search, category: activeCategory }, { preserveState: true, replace: true });
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleCategoryClick = (slug) => {
        const nextCategory = activeCategory === slug ? '' : slug;
        setActiveCategory(nextCategory);
        router.get('/', { search, category: nextCategory }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white">
            <Head title="Cinema - Sevimli Filmlaringizni Tomosha Qiling" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Film className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">ICE<span className="text-indigo-500">SOFT</span> CINEMA</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-sm font-bold text-white/60 hover:text-white transition-colors"
                            >
                                Boshqaruv Paneli
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm font-bold text-white/60 hover:text-white transition-colors">Kirish</Link>
                                <Link
                                    href={route('register')}
                                    className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all scale-100 hover:scale-105 active:scale-95"
                                >
                                    Hoziroq Qo'shiling
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="max-w-3xl">
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            Cheksiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Kinematik</span> Tajriba
                        </h1>
                        <p className="mt-8 text-xl text-white/40 font-medium max-w-xl leading-relaxed">
                            Eng so'nggi blokbasterlar, indie durdonalari va o'lmas klassikalarni ajoyib 4K sifatda kashf eting.
                        </p>
                    </div>

                    {/* Search & Filters */}
                    <div className="mt-12 space-y-8">
                        <div className="relative max-w-2xl group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filmlar, janrlar, aktyorlarni qidiring..."
                                className="w-full bg-white/5 border border-white/10 rounded-full py-6 pl-16 pr-8 text-lg font-medium focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleCategoryClick('')}
                                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === '' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                            >
                                Barcha Filmlar
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.slug)}
                                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeCategory === category.slug ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
                    <AdBanner ads={ads} position="home_top" auth={auth} />
                </div>
            </div>

            {/* Movie Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-32">
                {movies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {movies.map((movie) => (
                            <Link
                                key={movie.id}
                                href={route('movies.show', movie.id)}
                                className="group relative"
                            >
                                <div className="aspect-[2/3] rounded-[32px] overflow-hidden bg-white/5 border border-white/10 relative transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                                    <img
                                        src={movie.poster_url || `/storage/${movie.poster}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                                        {movie.is_premium ? (
                                            <div className="bg-amber-500 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-xl shadow-amber-500/40">
                                                <Star className="h-3 w-3 text-white fill-white" />
                                                <span className="text-[10px] font-black tracking-tighter text-white uppercase">Premium</span>
                                            </div>
                                        ) : (
                                            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                <span className="text-[10px] font-black tracking-tighter">{movie.average_rating || 'N/A'}</span>
                                            </div>
                                        )}
                                        <div className="bg-indigo-600 px-3 py-1.5 rounded-full flex items-center justify-center border border-white/20">
                                            <span className="text-[8px] font-black uppercase tracking-widest">{movie.year}</span>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                                        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-black shadow-2xl">
                                            <Play className="h-6 w-6 fill-black ml-1" />
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{movie.category?.name}</p>
                                            {movie.is_premium && movie.price > 0 && (
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{Number(movie.price).toLocaleString()} UZS</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter">{movie.title}</h3>
                                        <div className="mt-3 flex items-center gap-4 text-white/30 text-[10px] uppercase font-black tracking-widest">
                                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {movie.duration}</span>
                                            <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> {movie.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[60px]">
                        <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Film className="h-10 w-10 text-white/10" />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Filmlar Topilmadi</h2>
                        <p className="text-white/20 mt-2 font-medium">Qidiruv yoki filtrlarni o'zgartirib ko'ring</p>
                    </div>
                )}
            </div>

            <footer className="border-t border-white/5 py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <Film className="h-4 w-4 text-white/40" />
                        </div>
                        <span className="text-sm font-black tracking-tighter uppercase italic text-white/40">ICE<span className="text-indigo-500/40">SOFT</span> CINEMA</span>
                    </div>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">© 2026 Premium Kino Tajribasi</p>
                    <div className="flex gap-8 text-white/20 text-[10px] font-black uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Maxfiylik</a>
                        <a href="#" className="hover:text-white transition-colors">Shartlar</a>
                        <a href="#" className="hover:text-white transition-colors">Aloqa</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
