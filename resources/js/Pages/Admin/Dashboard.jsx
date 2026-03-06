import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { Film, Tags, Users, MessageSquare } from 'lucide-react';

export default function Dashboard({ stats: serverStats = {} }) {
    const stats = [
        { name: 'Jami Kinolar', value: serverStats.movies || 0, icon: Film, color: 'indigo' },
        { name: 'Kategoriyalar', value: serverStats.categories || 0, icon: Tags, color: 'violet' },
        { name: 'Faol Foydalanuvchilar', value: serverStats.users || 0, icon: Users, color: 'blue' },
        { name: 'Izohlar', value: serverStats.comments || 0, icon: MessageSquare, color: 'emerald' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Boshqaruv Paneli" />

            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.name} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl hover:border-indigo-500/50 transition-all group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-600/10 blur-3xl -mr-12 -mt-12 group-hover:bg-${stat.color}-600/20 transition-all`}></div>
                            <div className="flex items-center gap-4">
                                <div className={`h-14 w-14 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center shrink-0`}>
                                    <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
                                </div>
                                <div>
                                    <p className="text-white/40 text-sm font-semibold">{stat.name}</p>
                                    <h3 className="text-3xl font-black mt-1 tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-indigo-900/40 via-violet-900/20 to-[#0a0a0a] border border-indigo-500/20 rounded-[40px] p-12 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('/images/auth-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 transition-transform duration-1000 group-hover:scale-105"></div>
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">Admin Paneli</span>
                        <h1 className="text-5xl font-black tracking-tight mb-6">Boshqaruv Markaziga <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Xush Kelibsiz</span></h1>
                        <p className="text-xl text-white/60 leading-relaxed mb-10">Kino kutubxonangizni, kategoriyalarni va barcha jarayonlarni bitta markazdan boshqaring. Keyingi blokbasterni yuklashga tayyormisiz?</p>
                        <div className="flex gap-4">
                            <Link href={route('admin.movies.create')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/30 active:scale-95 text-center">Yangi Kino Qo'shish</Link>
                            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all border border-white/10 active:scale-95">Tahlillarni Ko'rish</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
