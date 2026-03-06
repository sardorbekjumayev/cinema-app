import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import Toast from '@/Components/Toast';
import {
    LayoutDashboard,
    Film,
    Tags,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    MessageSquare,
    Megaphone
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth, flash, errors } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        } else if (flash?.info) {
            setToast({ type: 'info', message: flash.info });
        } else if (flash?.warning) {
            setToast({ type: 'warning', message: flash.warning });
        } else if (errors && Object.keys(errors).length > 0) {
            setToast({ type: 'error', message: 'Iltimos, ma\'lumotlarni tekshiring.' });
        }
    }, [flash, errors]);

    const navigation = [
        { name: 'Boshqaruv', href: route('admin.dashboard'), icon: LayoutDashboard, active: route().current('admin.dashboard') },
        { name: 'Kinolar', href: route('admin.movies.index'), icon: Film, active: route().current('admin.movies.*') },
        { name: 'Kategoriyalar', href: route('admin.categories.index'), icon: Tags, active: route().current('admin.categories.*') },
        { name: 'Foydalanuvchilar', href: route('admin.users.index'), icon: Users, active: route().current('admin.users.*') },
        { name: 'Izohlar', href: route('admin.comments.index'), icon: MessageSquare, active: route().current('admin.comments.*') },
        { name: 'Reklamalar', href: route('admin.ads.index'), icon: Megaphone, active: route().current('admin.ads.*') },
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white flex">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-[#0a0a0a] border-r border-white/10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center px-6 border-b border-white/10">
                        <Link href="/" className="flex items-center gap-3 group">
                            <ApplicationLogo className="h-10 w-10 fill-current text-indigo-500 transition-transform group-hover:scale-110" />
                            {isSidebarOpen && (
                                <span className="text-xl font-black tracking-tighter uppercase italic">
                                    Cinema<span className="text-indigo-500">Admin</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative ${item.active
                                    ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`h-6 w-6 shrink-0 ${item.active ? 'text-white' : 'group-hover:text-indigo-400'}`} />
                                {isSidebarOpen && (
                                    <span className="font-semibold">{item.name}</span>
                                )}
                                {!isSidebarOpen && (
                                    <div className="absolute left-16 bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-sm border border-white/10">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                        >
                            {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
            >
                {/* Header */}
                <header className="h-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {navigation.find(n => n.active)?.name || 'Admin'}
                    </h2>

                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 group focus:outline-none">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wider">{auth.user.name}</p>
                                            <p className="text-[10px] text-white/40 font-medium">TIZIM ADMINISTRATORI</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border-2 border-white/10">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profil Sozlamalari</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Chiqish
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(79, 70, 229, 0.5);
                }
            `}</style>
        </div>
    );
}
