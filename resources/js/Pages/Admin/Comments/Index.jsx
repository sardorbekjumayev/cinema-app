import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, router, Link } from '@inertiajs/react';
import { MessageSquare, Trash2, Film, User, Calendar, ExternalLink } from 'lucide-react';

export default function Index({ comments }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(route('admin.comments.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Izohlarni Moderatsiya Qilish" />

            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Izohlar <span className="text-indigo-500">Moderatsiyasi</span></h1>
                        <p className="text-white/40 font-medium mt-1">Hamjamiyat muhokamalarini ko'rib chiqing va sifatni saqlang</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-3xl p-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/20">Jami Izohlar</p>
                            <p className="text-xl font-bold">{comments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 group hover:border-indigo-500/30 transition-all">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Movie Info */}
                                    <div className="md:w-64 shrink-0 space-y-4">
                                        <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group-hover:bg-indigo-600/5 transition-colors">
                                            <img
                                                src={`/storage/${comment.movie.poster}`}
                                                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Film className="h-8 w-8 text-white/10 group-hover:text-white/20 transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Kino</p>
                                            <Link
                                                href={route('movies.show', comment.movie.id)}
                                                className="font-bold text-sm hover:text-indigo-400 transition-colors flex items-center gap-2 group/link"
                                            >
                                                {comment.movie.title}
                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Comment Content */}
                                    <div className="flex-1 flex flex-col justify-between space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                                        {comment.user.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{comment.user.name}</p>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{comment.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/20">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <p className="text-white/60 text-lg font-medium italic leading-relaxed">
                                                "{comment.content}"
                                            </p>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all text-xs font-black uppercase tracking-widest"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Izohni O'chirish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[60px]">
                            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="h-10 w-10 text-white/10" />
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Muhokamalar Toza</h2>
                            <p className="text-white/20 mt-2 font-medium">Hali hech qanday izoh qoldirilmagan</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
