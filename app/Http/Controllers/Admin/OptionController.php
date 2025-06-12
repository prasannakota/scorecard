<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Option;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Question;

class OptionController extends Controller
{
    public function index()
    {
        return response()->json(Option::all());
    }

    public function show($id)
    {
        $option = Option::find($id);
        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }
        return response()->json($option);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'options.text' => 'required|string|max:255',
            'options.score' => 'nullable|integer',
            'questionId' => 'required|integer'
        ]);

        $option = Option::create([
            'option_text' => $data['options']['text'],
            'option_score' => $data['options']['score'] ?? 0
        ]);


        // Associate the option with the question
        $question = Question::findOrFail($data['questionId']);
        $question->options()->attach($option->id);


        return response()->json([
            'message' => 'Option created successfully',
            'data' => [
                'id' => $option->id,
                'text' => $option->option_text,
                'score' => $option->option_score,
            ]
        ], 201);
    }

    public function update(Request $request)
    {
        $optionData = $request->input('options');

        $option = Option::find($optionData['id']);
        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }

        $validatedData = Validator::make($optionData, [
            'text' => 'required|string|max:255',
            'score' => 'required|integer',
        ])->validate();

        // Map validated data to your database columns
        $option->update([
            'option_text' => $validatedData['text'],
            'option_score' => $validatedData['score'],
        ]);

        return response()->json(['message' => 'Option updated successfully', 'data' => $option]);
    }


    public function destroy($id)
    {
        $option = Option::find($id);
        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }

        $option->delete();

        return response()->json(['message' => 'Option deleted successfully']);
    }
}

