<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    /**
     * Display the billing settings.
     */
    public function index(Request $request): Response
    {
        $intent = null;

        if (config('cashier.secret')) {
            try {
                $intent = $request->user()->createSetupIntent();
            } catch (\Exception $e) {
                // Log or handle error if needed
            }
        }

        return Inertia::render('settings/billing', [
            'intent' => $intent,
            'subscription' => $request->user()->subscription('default'),
        ]);
    }
}
