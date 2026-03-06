import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Kirish" />

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                    Xush Kelibsiz
                </h1>
                <p className="text-indigo-200/60 font-medium">
                    Tizimga kirish uchun ma'lumotlaringizni kiriting
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm font-medium text-green-400 backdrop-blur-sm">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email Manzili" className="text-white/80 ml-1 mb-1.5" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl transition-all duration-200"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 text-red-400 font-medium" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="bg-white/5 border-white/10 text-indigo-500 focus:ring-indigo-500/50 rounded"
                        />
                        <span className="ms-3 text-sm text-white/60 group-hover:text-white/90 transition-colors">
                            Eslab qolish
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium border-b border-transparent hover:border-indigo-400"
                        >
                            Parolni unutdingizmi?
                        </Link>
                    )}
                </div>

                <div className="mt-8">
                    <PrimaryButton
                        className="w-full justify-center py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 border-none transition-all duration-300 transform active:scale-[0.98]"
                        disabled={processing}
                    >
                        Tizimga Kirish
                    </PrimaryButton>

                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-sm">
                            Hisobingiz yo'qmi?{' '}
                            <Link
                                href={route('register')}
                                className="text-white hover:text-indigo-400 font-bold transition-all ml-1 underline decoration-indigo-500/50 underline-offset-4"
                            >
                                Ro'yxatdan o'tish
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
