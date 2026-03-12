import AdminLayout from '@/Layouts/Admin/SidebarLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Film, Upload, Info, Image as ImageIcon, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import axios from 'axios';

export default function Create({ categories }) {
    const posterInput = useRef();
    const videoInput = useRef();
    const [posterPreview, setPosterPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedPath, setUploadedPath] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        title: '',
        description: '',
        genres: '',
        country: '',
        year: new Date().getFullYear(),
        language: "O'zbekcha",
        duration: '',
        age_limit: '',
        poster: null,
        video_path: '',
        is_premium: false,
        price: 0,
    });

    const handlePosterSelect = (e) => {
        const file = e.target.files[0];
        setData('poster', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPosterPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleVideoSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setUploadedPath(null);

        const chunkSize = 512 * 1024; // 512KB for maximum compatibility with low server limits
        const totalChunks = Math.ceil(file.size / chunkSize);
        const uuid = `${file.name}-${file.size}-${Date.now()}`;
        let currentChunk = 0;

        try {
            while (currentChunk < totalChunks) {
                const start = currentChunk * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('file', chunk);
                formData.append('dzuuid', uuid);
                formData.append('dzchunkindex', currentChunk);
                formData.append('dztotalchunkcount', totalChunks);
                formData.append('dzchunksize', chunkSize);
                formData.append('dztotalfilesize', file.size);
                formData.append('dzchunkbyteoffset', start);

                console.log(`Uploading chunk ${currentChunk + 1}/${totalChunks} size ${chunk.size}`);

                const response = await axios.post(route('admin.movies.upload-chunk'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    onUploadProgress: (progressEvent) => {
                        const chunkProgress = (progressEvent.loaded / progressEvent.total) * 100;
                        const overallProgress = ((currentChunk / totalChunks) * 100) + (chunkProgress / totalChunks);
                        setUploadProgress(Math.round(overallProgress));
                    }
                });

                if (response.data.finished) {
                    setUploadedPath(response.data.path);
                    setData('video_path', response.data.path);
                }

                currentChunk++;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            console.error('Upload failed details:', error.response?.data || error.message);
            alert(`Upload failed: ${errorMsg}. Check console for details.`);
        } finally {
            setIsUploading(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.video_path) {
            alert('Please wait for the video to finish uploading.');
            return;
        }
        post(route('admin.movies.store'));
    };

    return (
        <AdminLayout>
            <Head title="Film Yuklash" />

            <div className="max-w-6xl mx-auto space-y-10">
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.movies.index')}
                        className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 hover:text-white group"
                    >
                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Film <span className="text-indigo-500">Yuklash</span></h1>
                        <p className="text-white/40 font-medium mt-1">Kutubxonangizga yangi durdona qo'shing</p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Poster Upload */}
                    <div className="space-y-6">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-6">
                            <h3 className="flex items-center gap-3 text-lg font-bold">
                                <ImageIcon className="h-5 w-5 text-indigo-500" />
                                Kino Posteri
                            </h3>

                            <div
                                onClick={() => posterInput.current.click()}
                                className="aspect-[2/3] w-full rounded-3xl bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative group cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/[0.02] transition-all overflow-hidden"
                            >
                                {posterPreview ? (
                                    <>
                                        <img src={posterPreview} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-sm font-black tracking-widest uppercase">Rasmni O'zgartirish</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-6">
                                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="h-8 w-8 text-white/20" />
                                        </div>
                                        <p className="text-white/60 font-bold mb-1">Posterni Yuklash</p>
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">JPG, PNG 2MB gacha</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" hidden ref={posterInput} onChange={handlePosterSelect} accept="image/*" />
                            {errors.poster && <p className="text-red-400 text-xs font-bold mt-2 ml-2 tracking-wide uppercase">{errors.poster}</p>}
                        </div>

                        {/* Video Upload Status */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 space-y-6 overflow-hidden">
                            <h3 className="flex items-center gap-3 text-lg font-bold">
                                <Video className="h-5 w-5 text-indigo-500" />
                                Film Manbasi
                            </h3>

                            <div
                                onClick={() => !isUploading && videoInput.current.click()}
                                className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-all group relative ${isUploading ? 'cursor-wait' : 'hover:bg-white/10 cursor-pointer'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${data.video_path ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>
                                        {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : (data.video_path ? <CheckCircle2 className="h-6 w-6" /> : <Upload className="h-6 w-6" />)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">
                                            {isUploading ? `Yuklanmoqda... ${uploadProgress}%` : (data.video_path ? 'Video Tayyor' : 'Video Faylni Tanlang')}
                                        </p>
                                        <p className="text-[10px] text-white/20 font-black tracking-widest uppercase mt-1">Ishonchli qismlarga bo'lib yuklash (3GB+ OK)</p>
                                    </div>
                                </div>
                                {isUploading && (
                                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                )}
                            </div>
                            <input type="file" hidden ref={videoInput} onChange={handleVideoSelect} accept="video/*" />
                            {errors.video_path && <p className="text-red-400 text-xs font-bold mt-2 ml-2 tracking-wide uppercase">{errors.video_path}</p>}
                        </div>
                    </div>

                    {/* Right: Movie Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 space-y-10">
                            <h3 className="flex items-center gap-3 text-2xl font-black italic uppercase tracking-tighter">
                                <Info className="h-6 w-6 text-indigo-500" />
                                Film <span className="text-indigo-500">Tafsilotlari</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Sarlavha</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-white/10"
                                        placeholder="Kino sarlavhasini kiriting"
                                    />
                                    {errors.title && <p className="text-red-400 text-xs font-bold mt-2 ml-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Kategoriya</label>
                                    <select
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
                                    >
                                        <option value="" disabled>Kategoriyani Tanlang</option>
                                        {categories.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name}</option>)}
                                    </select>
                                    {errors.category_id && <p className="text-red-400 text-xs font-bold mt-2 ml-1">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Yil</label>
                                    <input
                                        type="number"
                                        value={data.year}
                                        onChange={e => setData('year', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Janrlar</label>
                                    <input
                                        type="text"
                                        value={data.genres}
                                        onChange={e => setData('genres', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="Masalan: Jangari / Sarguzasht"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Davlat</label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={e => setData('country', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Til</label>
                                    <input
                                        type="text"
                                        value={data.language}
                                        onChange={e => setData('language', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Davomiyligi</label>
                                    <input
                                        type="text"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="1soat 25daq"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Yoshing chegarasi</label>
                                    <input
                                        type="text"
                                        value={data.age_limit}
                                        onChange={e => setData('age_limit', e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="Cheklangan yosh"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold uppercase tracking-tight">Premium Kino</p>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Ko'rish uchun obuna talab qilinadi</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_premium', !data.is_premium)}
                                        className={`h-7 w-12 rounded-full transition-all relative ${data.is_premium ? 'bg-indigo-600' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${data.is_premium ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block ml-1">Tavsif</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="4"
                                        className="w-full bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white font-semibold focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="Ushbu film dunyosi haqida yozing..."
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex justify-end gap-6">
                                <Link href={route('admin.movies.index')} className="px-10 py-5 rounded-2xl font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest text-xs">Bekor Qilish</Link>
                                <button
                                    disabled={processing || isUploading || !data.video_path}
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] active:scale-[0.98] text-white px-12 py-5 rounded-2xl font-black tracking-widest uppercase text-xs transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50"
                                >
                                    {isUploading ? 'Video Yuklanmoqda...' : 'Tugatish va Chiqarish'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
