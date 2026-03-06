<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\PayXService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected $payX;

    public function __construct(PayXService $payX)
    {
        $this->payX = $payX;
    }

    public function index()
    {
        return Inertia::render('Subscription/Index', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:premium,pro',
        ]);

        $plans = [
            'premium' => [
                'amount' => 29000,
                'description' => 'Premium obuna (1 oy)',
            ],
            'pro' => [
                'amount' => 49000,
                'description' => 'Pro Ultra obuna (1 oy)',
            ],
        ];

        $plan = $plans[$request->plan];
        $user = auth()->user();
        \Illuminate\Support\Facades\Log::info('Subscription Attempt', [
            'user_id' => $user->id,
            'plan' => $request->plan,
            'amount' => $plan['amount']
        ]);

        // Create local payment record first
        $payment = Payment::create([
            'user_id' => $user->id,
            'amount' => $plan['amount'],
            'plan' => $request->plan,
            'status' => 'pending',
        ]);

        \Illuminate\Support\Facades\Log::info('Local Payment Created', ['payment_id' => $payment->id]);

        // Create PayX Invoice
        $invoice = $this->payX->createInvoice(
            $plan['amount'],
            $plan['description'],
            $payment->id
        );

        \Illuminate\Support\Facades\Log::info('PayX Invoice Response', ['response' => $invoice]);

        if (!$invoice || !isset($invoice['uuid'])) {
            $payment->update(['status' => 'failed']);
            return response()->json([
                'error' => 'To\'lov tizimida xatolik yuz berdi. Iltimos keyinroq qayta urinib ko\'ring.'
            ], 422);
        }

        $payment->update([
            'invoice_uuid' => $invoice['uuid'],
            'payload' => $invoice
        ]);

        return response()->json([
            'pay_url' => $invoice['pay_url'],
            'payment_id' => $payment->id
        ]);
    }

    public function verify(Payment $payment)
    {
        if ($payment->status === 'completed') {
            return redirect()->route('dashboard')->with('success', 'Obuna muvaffaqiyatli faollashtirildi!');
        }

        if (!$payment->invoice_uuid) {
            return redirect()->route('subscriptions.index')->with('error', 'To\'lov ma\'lumotlari topilmadi.');
        }

        $info = $this->payX->getInvoiceInfo($payment->invoice_uuid);

        if ($info && isset($info['invoice']['status']) && $info['invoice']['status'] === 'success') {
            $payment->update([
                'status' => 'completed',
                'payload' => array_merge($payment->payload ?? [], ['verification' => $info])
            ]);

            $user = $payment->user;
            $user->update([
                'status' => $payment->plan,
                'subscription_expires_at' => now()->addMonth(),
            ]);

            return redirect()->route('dashboard')->with('success', 'Tabriklaymiz! ' . ucfirst($payment->plan) . ' obunangiz faollashtirildi.');
        }

        return redirect()->route('subscriptions.index')->with('info', 'To\'lov hali amalga oshirilmadi yoki kutilmoqda.');
    }
}
