<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\FeedbackReceived;

class FeedbackController extends Controller
{

    public function store(Request $request)
    {

        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|max:255',
            'rating'     => 'required|integer|between:1,5',
            'feedback'   => 'required|string',
            'consent'    => 'boolean',
        ]);

        $feedback = Feedback::create($data);

        // Send an email
        Mail::to('support@example.com')->send(new FeedbackReceived($feedback));

        return response()->json([
            'message' => 'Feedback submitted successfully.',
            'code' => 200,
        ]);
    }
}
