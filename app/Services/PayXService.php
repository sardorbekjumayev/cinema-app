<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayXService
{
    protected string $baseUrl = 'https://backend.payx.uz/api/v1';
    protected string $token;

    public function __construct()
    {
        $this->token = config('services.payx.token');
    }

    /**
     * Create a new invoice.
     *
     * @param int|float $amount
     * @param string $description
     * @param string|int $payerReference
     * @return array|null
     */
    public function createInvoice($amount, string $description, $payerReference)
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Accept-Language' => 'uz',
                'Authorization' => 'Bearer ' . $this->token,
            ])->post($this->baseUrl . '/invoice', [
                'amount' => (int) $amount,
                'description' => $description,
                'payer_reference' => (string) $payerReference,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('PayX Invoice Creation Failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'headers' => $response->headers(),
                'url' => $this->baseUrl . '/invoice'
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('PayX Service Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get invoice information.
     *
     * @param string $uuid
     * @return array|null
     */
    public function getInvoiceInfo(string $uuid)
    {
        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Accept-Language' => 'uz',
            ])->get($this->baseUrl . "/pay/{$uuid}/info");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('PayX Info Retrieval Error: ' . $e->getMessage());
            return null;
        }
    }
}
