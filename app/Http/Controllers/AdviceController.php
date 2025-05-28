<?php

namespace App\Http\Controllers;

use App\Models\Advice;
use Illuminate\Http\Request;
use App\Mail\AdviceReceived;
use Illuminate\Support\Facades\Mail;

class AdviceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string|max:255',
            'category' => 'required|string',
            'priority' => 'required|string',
            'message' => 'required|string',
            'consent' => 'boolean',
        ]);

        $advice = Advice::create($validated);

        Mail::to(config('mail.from.address'))->send(new AdviceReceived($advice));

        return response()->json([
            'message' => 'Advice submitted successfully!',
            'code' => 200,
        ]);
    }
}
