import { Head, Link, useForm, router } from '@inertiajs/react';
import { ChevronLeft, Star, Clock, Globe, Calendar, User, MessageSquare, Send, Play, Info, AlertCircle, Download, Monitor, Film, OctagonAlert } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import AdBanner from '@/Components/Cinema/AdBanner';

export default function Show({ auth, movie, average_rating, user_rating, can_watch, ads }) {
    const [activeTab, setActiveTab] = useState('info');
    const [hoverRating, setHoverRating] = useState(0);
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
    });

    const { data: ratingData, setData: setRatingData, post: postRating, processing: ratingProcessing } = useForm({
        stars: user_rating || 0,
    });

    const ratingLabels = {
        1: 'Yomon',
        2: 'Qoniqarli',
        3: 'Yaxshi',
        4: 'Juda Yaxshi',
        5: 'Ajoyib'
    };

    useEffect(() => {
        if (videoRef.current && can_watch) {
            playerRef.current = new Plyr(videoRef.current, {
                quality: {
                    default: 0,
                    options: [1080, 720, 0],
                    forced: true,
                },
                controls: [
                    'play-large', 'restart', 'rewind', 'play', 'fast-forward',
                    'progress', 'current-time', 'duration', 'mute', 'volume',
                    'captions', 'settings', 'pip', 'airplay', 'fullscreen'
                ],
                settings: ['quality', 'speed'],
                tooltips: { controls: true, seek: true }
            });
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [can_watch]);

    const handleComment = (e) => {
        e.preventDefault();
        post(route('movies.comment', movie.id), {
            onSuccess: () => reset('content'),
            preserveScroll: true,
        });
    };

    const handleRate = (stars) => {
        setRatingData('stars', stars);
        postRating(route('movies.rate', movie.id), {
            preserveScroll: true,
        });
    };

    const handleUnrate = () => {
        router.delete(route('movies.unrate', movie.id), {
            preserveScroll: true,
            onSuccess: () => setRatingData('stars', 0)
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500 selection:text-white pb-32">
            <Head title={`${movie.title} - Hoziroq Tomosha Qiling`} />

            {/* Navbar / Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-600/20 to-transparent blur-[120px] pointer-events-none opacity-50"></div>

            <nav className="relative z-50 px-8 py-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href={route('welcome')}
                        className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white group"
                    >
                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                    </Link>

                    <div className="flex items-center gap-6">
                        {auth.user ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs font-black uppercase tracking-widest text-white/40">{auth.user.name}</p>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{auth.user.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}</p>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 border border-white/20 flex items-center justify-center font-black">
                                    {auth.user.name[0]}
                                </div>
                            </div>
                        ) : (
                            <Link href={route('login')} className="bg-indigo-600 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Kirish</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Video Player Section */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="aspect-video w-full rounded-[40px] overflow-hidden bg-black border border-white/10 shadow-2xl relative group player-wrapper">
                        {can_watch ? (
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                poster={movie.poster_url || `/storage/${movie.poster}`}
                                playsInline
                                crossOrigin="anonymous"
                            >
                                {movie.versions?.['1080p'] && <source src={`/storage/${movie.versions['1080p']}`} type="video/mp4" size="1080" />}
                                {movie.versions?.['720p'] && <source src={`/storage/${movie.versions['720p']}`} type="video/mp4" size="720" />}
                                <source src={`/storage/${movie.video_path}`} type="video/mp4" size="Original" />
                            </video>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#111]">
                                <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20">
                                    <Star className="h-10 w-10 text-indigo-500 fill-indigo-500 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Premium Tarkib</h3>
                                <p className="text-white/40 font-medium mb-8 max-w-xs text-center">Sizda bu kinoni ko'rish uchun obuna yo'q. Iltimos, obunani yangilang.</p>
                                <Link
                                    href={route('subscriptions.index')}
                                    className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                                >
                                    Obunani rasmiylashtirish
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-2">{movie.category?.name}</p>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">{movie.title}</h1>

                                {can_watch && (
                                    <div className="mt-6 flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white/40">
                                            <Monitor className="h-4 w-4" />
                                            {movie.is_premium ? 'Premium Striming' : 'HD Pleyer Faol'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`h-6 w-6 ${s <= Math.round(Number(average_rating)) ? 'text-yellow-500 fill-yellow-500' : 'text-white/10'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{Number(average_rating).toFixed(1)} / 5.0 (Umumiy Reyting)</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10">
                                <Clock className="h-5 w-5 text-indigo-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Davomiyligi</span>
                                    <span className="text-sm font-bold">{movie.duration}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10">
                                <Globe className="h-5 w-5 text-indigo-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Davlat</span>
                                    <span className="text-sm font-bold">{movie.country}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10">
                                <Calendar className="h-5 w-5 text-indigo-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Yil</span>
                                    <span className="text-sm font-bold">{movie.year}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-white/10">
                                <OctagonAlert className="h-5 w-5 text-indigo-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Yosh chegarasi</span>
                                    <span className="text-sm font-bold">{movie.age_limit}</span>
                                </div>
                            </div>
                        </div>

                        <AdBanner ads={ads} position="movie_page" auth={auth} />
                    </div>

                    {/* Tabs */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 space-y-10">
                        <div className="flex items-center gap-10 border-b border-white/5">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`pb-6 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                Sinospsis
                                {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-full"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('cast')}
                                className={`pb-6 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'cast' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                Aktyorlar va Jamoa
                                {activeTab === 'cast' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 rounded-full"></div>}
                            </button>
                        </div>

                        <div className="min-h-[200px]">
                            {activeTab === 'info' ? (
                                <p className="text-lg text-white/60 font-medium leading-relaxed italic">
                                    {movie.description}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Ishlab chiqarish jamoasi</p>
                                        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex items-center gap-4 hover:border-indigo-500/20 transition-all">
                                            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                                <User className="h-6 w-6 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Rejissyor</p>
                                                <p className="text-lg font-bold">Standard Distribution</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Janrlar va Stillar</p>
                                        <div className="flex flex-wrap gap-3">
                                            {movie.genres?.split('/').map((genre, idx) => (
                                                <div key={idx} className="bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-4 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all group">
                                                    <Film className="h-5 w-5 text-white/10 group-hover:text-indigo-400 transition-colors" />
                                                    <p className="text-sm font-bold">{genre.trim()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Rating & Comments */}
                <div className="space-y-10">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-8">
                        <h3 className="flex items-center gap-3 text-xl font-bold uppercase italic tracking-tighter">
                            <Star className="h-5 w-5 text-indigo-500" />
                            Sizning <span className="text-indigo-500">Bahongiz</span>
                        </h3>

                        {auth.user ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                                    {ratingProcessing && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center"><div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>}
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleRate(s)}
                                            onMouseEnter={() => setHoverRating(s)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="group transition-transform active:scale-95"
                                        >
                                            <Star
                                                className={`h-8 w-8 transition-all ${s <= (hoverRating || ratingData.stars || user_rating) ? 'text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'text-white/10 group-hover:text-white/30'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">
                                    {(hoverRating || ratingData.stars) ? (
                                        <span className="text-indigo-400">{ratingLabels[hoverRating || ratingData.stars]}</span>
                                    ) : (
                                        'Filmga baho bering'
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Link href={route('login')} className="block w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all text-center">Baho berish uchun kiring</Link>
                            </div>
                        )}
                    </div>

                    <AdBanner ads={ads} position="sidebar" auth={auth} />

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-8">
                        <h3 className="flex items-center gap-3 text-xl font-bold uppercase italic tracking-tighter">
                            <MessageSquare className="h-5 w-5 text-indigo-500" />
                            Muhokama <span className="text-indigo-500">Maydoni</span>
                        </h3>

                        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {auth.user ? (
                                <form onSubmit={handleComment} className="relative group">
                                    <textarea
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="Fikringizni qoldiring..."
                                        className="w-full bg-white/5 border border-white/10 rounded-[32px] p-6 pr-16 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none min-h-[120px]"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="absolute bottom-4 right-4 h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                    {errors.content && <p className="mt-2 text-xs text-red-500 font-bold uppercase tracking-widest">{errors.content}</p>}
                                </form>
                            ) : (
                                <div className="bg-white/5 border border-white/5 p-8 rounded-[32px] text-center space-y-4">
                                    <AlertCircle className="h-10 w-10 text-white/20 mx-auto" />
                                    <p className="text-xs font-black uppercase tracking-widest text-white/40">Fikr qoldirish uchun tizimga kiring</p>
                                    <Link href={route('login')} className="inline-block px-8 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">Kirish</Link>
                                </div>
                            )}

                            {movie.comments.length > 0 ? (
                                movie.comments.map((comment) => (
                                    <div key={comment.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                                {comment.user.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold">{comment.user.name}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed font-medium">{comment.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-white/20 text-xs uppercase font-black tracking-widest">Hozircha hech qanday fikr yo'q</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .player-wrapper .plyr {
                    border-radius: 40px;
                    --plyr-color-main: #4f46e5;
                }
            `}</style>
        </div>
    );
}
