import { ExternalLink, Megaphone } from 'lucide-react';

export default function AdBanner({ ads, position, auth }) {
    if (!ads || ads.length === 0) return null;

    // Hide ads for premium users
    if (auth?.user?.is_premium) return null;

    // Filtration happens in controller, but we double check
    const positionAds = ads.filter(ad => ad.position === position);

    if (positionAds.length === 0) return null;

    const isSidebar = position === 'sidebar';

    // Simple carousel-like or grid display for ads
    return (
        <div className={`w-full ${position === 'home_top' ? 'mb-12' : 'my-8'} ${isSidebar ? 'px-0' : ''}`}>
            <div className={`flex items-center gap-2 mb-4 ${isSidebar ? 'px-0' : 'px-2'}`}>
                <Megaphone className={`h-3 w-3 ${isSidebar ? 'text-indigo-400' : 'text-indigo-500/50'}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isSidebar ? 'text-white/40' : 'text-white/20'}`}>Sponsored</span>
            </div>

            <div className={`grid gap-6 ${!isSidebar && positionAds.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {positionAds.map((ad) => (
                    <a
                        key={ad.id}
                        href={ad.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative block w-full rounded-[32px] overflow-hidden border border-white/5 bg-white/5 transition-all duration-500 hover:scale-[1.01] hover:border-indigo-500/30 shadow-2xl ${isSidebar ? 'aspect-square md:aspect-[4/5]' : 'aspect-[21/9] md:aspect-[24/7]'}`}
                    >
                        <img
                            src={`/storage/${ad.image}`}
                            alt={ad.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                        />

                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end ${isSidebar ? 'p-6' : 'p-8 md:p-12'}`}>
                            <h3 className={`font-black uppercase italic tracking-tighter text-white group-hover:text-indigo-400 transition-colors ${isSidebar ? 'text-lg leading-tight' : 'text-xl md:text-3xl'}`}>{ad.title}</h3>
                            <div className={`flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 ${isSidebar ? 'mt-2' : 'mt-4'}`}>
                                <span className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                                    {isSidebar ? 'Go' : 'Learn More'}
                                    <ExternalLink className="h-3 w-3" />
                                </span>
                            </div>
                        </div>

                        {/* Glassmorphic border effect */}
                        <div className="absolute inset-0 border border-white/10 rounded-[32px] pointer-events-none group-hover:border-indigo-500/20 transition-colors"></div>
                    </a>
                ))}
            </div>
        </div>
    );
}
