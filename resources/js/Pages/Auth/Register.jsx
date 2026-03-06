import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Ro'yxatdan O'tish" />
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    Hisob Yaratish
                </h1>
                <p className="text-indigo-200/60 font-medium">
                    Bugun bizning kino hamjamiyatimizga qo'shiling
                </p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="To'liq Ism" className="text-white/80 ml-1 mb-1.5" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition-all duration-200"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Ismingizni kiriting"
                    />

                    <InputError message={errors.name} className="mt-2 text-red-400 font-medium" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="email" value="Email Manzili" className="text-white/80 ml-1 mb-1.5" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition-all duration-200"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="misol@email.com"
                    />

                    <InputError message={errors.email} className="mt-2 text-red-400 font-medium" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="password" value="Parol" className="text-white/80 ml-1 mb-1.5" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition-all duration-200"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 text-red-400 font-medium" />
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Parolni Tasdiqlang"
                        className="text-white/80 ml-1 mb-1.5"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition-all duration-200"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                        placeholder="••••••••"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-red-400 font-medium"
                    />
                </div>

                <div className="mt-8">
                    <PrimaryButton
                        className="w-full justify-center py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 border-none transition-all duration-300 transform active:scale-[0.98]"
                        disabled={processing}
                    >
                        Hisob Yaratish
                    </PrimaryButton>

                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-sm">
                            Hisobingiz bormi?{' '}
                            <Link
                                href={route('login')}
                                className="text-white hover:text-indigo-400 font-bold transition-all ml-1 underline decoration-indigo-500/50 underline-offset-4"
                            >
                                Kirish
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
