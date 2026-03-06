import { Head, Link, router } from '@inertiajs/react';
import { Check, Star, Zap, Shield, Monitor, Download, Film, ChevronLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function Index({ auth }) {
    const [loading, setLoading] = useState(null);
    const userStatus = auth.user?.status || 'basic';
    const expiryDate = auth.user?.subscription_expires_at ? new Date(auth.user.subscription_expires_at).toLocaleDateString() : null;

    const handleSubscribe = async (planId) => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        setLoading(planId);
        try {
            const response = await axios.post(route('subscriptions.subscribe'), { plan: planId });
            if (response.data.pay_url) {
                window.location.href = response.data.pay_url;
            }
        } catch (error) {
            console.error('Subscription error:', error);
            const message = error.response?.data?.error || 'To\'lov jarayonini boshlashda xatolik yuz berdi.';
            alert(message);
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            id: 'premium',
            name: 'Premium',
            price: '29,000',
            icon: <Star className="h-6 w-6 text-indigo-400" />,
            description: 'Better experience for movie lovers.',
            features: [
                'Full Library Access',
                'HD Quality (720p/1080p)',
                'No Commercial Ads',
                'Watch on 2 screens',
                'Priority Support'
            ],
            color: 'from-indigo-500/20 to-violet-500/20',
            borderColor: 'border-indigo-500/30',
            buttonColor: 'bg-indigo-600 hover:bg-indigo-500'
        },
        {
            id: 'pro',
            name: 'Pro Ultra',
            price: '49,000',
            icon: <Zap className="h-6 w-6 text-amber-500" />,
            description: 'The ultimate cinematic experience.',
            features: [
                'Everything in Premium',
                '4K Ultra HD Quality',
                'Watch on 4 screens',
                'Early Access to New Movies',
                'Exclusive Content'
            ],
            color: 'from-amber-500/20 to-orange-500/20',
            borderColor: 'border-amber-500/30',
            buttonColor: 'bg-amber-500 hover:bg-amber-400 text-black'
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500">
            <Head title="Choose Your Plan - ICE SOFT Cinema" />

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Film className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic">ICE<span className="text-indigo-500">SOFT</span> CINEMA</span>
                    </Link>

                    <Link href={route('dashboard')} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold text-sm">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                        <Shield className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Safe & Secure Payments</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Plan</span>
                    </h1>

                    <p className="text-white/40 font-medium text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
                        Join millions of satisfied viewers and get unlimited access to the world's greatest cinema collection. No commitments, cancel anytime.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        {plans.map((plan) => {
                            const isActive = userStatus.toLowerCase() === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative p-8 rounded-[40px] border ${plan.borderColor} bg-gradient-to-br ${plan.color} backdrop-blur-sm flex flex-col items-start text-left transition-all duration-500 hover:scale-[1.02] ${isActive ? 'ring-2 ring-white/20' : ''}`}
                                >
                                    {isActive && (
                                        <div className="absolute top-6 right-8 bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                                            <Check className="h-3 w-3" />
                                            Active Plan
                                        </div>
                                    )}

                                    <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                        {plan.icon}
                                    </div>

                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{plan.name}</h3>
                                    <p className="text-white/40 text-sm font-medium mb-6">{plan.description}</p>

                                    <div className="flex items-baseline gap-2 mb-8">
                                        <span className="text-4xl font-black">{plan.price}</span>
                                        <span className="text-white/20 font-black uppercase tracking-widest text-xs">UZS / MONTH</span>
                                    </div>

                                    <div className="w-full space-y-4 mb-10">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm font-medium text-white/60">
                                                <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                                    <Check className="h-3 w-3 text-indigo-400" />
                                                </div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${isActive ? 'bg-white/5 text-white/40 cursor-default border border-white/5' : plan.buttonColor}`}
                                        disabled={isActive || loading === plan.id}
                                    >
                                        {loading === plan.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            isActive ? 'Current Subscription' : `Get ${plan.name}`
                                        )}
                                    </button>

                                    {isActive && expiryDate && (
                                        <p className="w-full text-center mt-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                                            Expires on: <span className="text-white/40">{expiryDate}</span>
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: <Monitor className="h-5 w-5" />, label: "Watch Anywhere" },
                            { icon: <Download className="h-5 w-5" />, label: "Offline Viewing" },
                            { icon: <Shield className="h-5 w-5" />, label: "Safe Payment" },
                            { icon: <Film className="h-5 w-5" />, label: "4K Resolution" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                    {item.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="border-t border-white/5 py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <Film className="h-4 w-4 text-white/40" />
                        </div>
                        <span className="text-sm font-black tracking-tighter uppercase italic text-white/40">ICE<span className="text-indigo-500/40">SOFT</span> CINEMA</span>
                    </div>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">© 2026 Premium Cinema Experience</p>
                    <div className="flex gap-8 text-white/20 text-[10px] font-black uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">Privacy Information</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
