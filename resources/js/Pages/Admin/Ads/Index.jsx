import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit2, ExternalLink, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function Index({ ads }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Haqiqatan ham ushbu reklamani o\'chirib tashlamoqchimisiz?')) {
            destroy(route('admin.ads.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin - Reklamalar" />

            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Reklamalar <span className="text-indigo-500">Boshqaruvi</span></h1>
                        <p className="text-white/40 font-medium mt-2 text-lg">Kontentni targ'ib qilish va hamkorliklarni boshqarish.</p>
                    </div>
                    <Link
                        href={route('admin.ads.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Yangi Reklama Qo'shish
                    </Link>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        {ads.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ads.map((ad) => (
                                    <div key={ad.id} className="group relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg">
                                        <div className="aspect-[16/9] w-full relative">
                                            <img
                                                src={`/storage/${ad.image}`}
                                                alt={ad.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <Link
                                                    href={route('admin.ads.edit', ad.id)}
                                                    className="p-2 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                {ad.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500 text-white border border-white/20 shadow-lg shadow-green-500/20">
                                                        <Eye className="h-3 w-3" />
                                                        Faol
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-500 text-white border border-white/20 shadow-lg shadow-gray-500/20">
                                                        <EyeOff className="h-3 w-3" />
                                                        O'chirilgan
                                                    </span>
                                                )}
                                            </div>
                                            <div className="absolute top-4 left-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white border border-white/20 shadow-lg shadow-indigo-600/20">
                                                    {ad.position === 'home_top' ? 'Asosiy Yuqori' : ad.position.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors uppercase italic tracking-tighter">{ad.title}</h3>
                                            {ad.url && (
                                                <a
                                                    href={ad.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-indigo-500 transition-colors"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Yo'nalishni Ko'rish
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon className="h-8 w-8 text-gray-300" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Reklamalar Topilmadi</h2>
                                <p className="mt-1 text-sm text-gray-500">Birinchi reklamangizni yaratishdan boshlang.</p>
                                <Link
                                    href={route('admin.ads.create')}
                                    className="mt-6 inline-flex items-center text-indigo-600 font-bold text-sm hover:text-indigo-500"
                                >
                                    Reklama Yaratish →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
