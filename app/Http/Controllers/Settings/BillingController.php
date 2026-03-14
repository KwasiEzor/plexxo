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
        return Inertia::render('settings/billing', [
            'intent' => $request->user()->createSetupIntent(),
            'subscription' => $request->user()->subscription('default'),
        ]);
    }
}
