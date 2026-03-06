import ApplicationLogo from '@/Components/ApplicationLogo';
import Toast from '@/Components/Toast';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function GuestLayout({ children }) {
    const { flash, errors } = usePage().props;
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

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center p-6 lg:p-12 overflow-hidden">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: "url('/images/auth-bg.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-indigo-900/40 backdrop-brightness-50"></div>
            </div>

            {/* Logo Section */}
            <div className="relative z-10 mb-8 transform transition-all duration-500 hover:scale-110">
                <Link href="/" className="flex flex-col items-center">
                    <ApplicationLogo className="h-24 w-24 fill-current text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    <span className="mt-2 text-3xl font-black tracking-tighter text-white uppercase italic">
                        Cinema<span className="text-indigo-500">App</span>
                    </span>
                </Link>
            </div>

            {/* Content Container with Glassmorphism */}
            <div className="relative z-10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 px-8 py-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-3xl ring-1 ring-white/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                    {children}
                </div>
            </div>
        </div>
    );
}
