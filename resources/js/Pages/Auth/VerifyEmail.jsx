import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Emailni Tasdiqlash" />

            <div className="mb-4 text-sm text-gray-600">
                Ro'yxatdan o'tganingiz uchun tashakkur! Boshlashdan oldin, biz sizga yuborgan havolani bosish orqali elektron pochta manzilingizni tasdiqlay olasizmi? Agar siz xatni olmagan bo'lsangiz, biz sizga mamnuniyat bilan boshqasini yuboramiz.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Ro'yxatdan o'tish paytida ko'rsatilgan elektron pochta manzilingizga yangi tasdiqlash havolasi yuborildi.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Tasdiqlash xatini qayta yuborish
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Chiqish
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
