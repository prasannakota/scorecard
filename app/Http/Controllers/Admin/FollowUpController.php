<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FollowUpQuestion;


class FollowUpController extends Controller
{
    public function saveFollowUps(Request $request)
    {
        $nodes = $request->input('nodes', []);

        $followUpsToInsert = [];

        foreach ($nodes as $node) {
            if (
                isset($node['type']) &&
                $node['type'] === 'question' &&
                isset($node['data']['isFollowUp']) &&
                $node['data']['isFollowUp'] === true
            ) {
                $optionId = $node['data']['optionId'] ?? null;
                $followUpQuestionId = $node['data']['followUpQuestionId'] ?? null;

                if ($optionId && $followUpQuestionId) {
                    $followUpsToInsert[] = [
                        'option_id' => $optionId,
                        'follow_up_question_id' => $followUpQuestionId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // Optionally clear old follow-ups for the given options
        $optionIds = collect($followUpsToInsert)->pluck('option_id')->unique()->toArray();
        FollowUpQuestion::whereIn('option_id', $optionIds)->delete();

        // Bulk insert new follow-up mappings
        FollowUpQuestion::insert($followUpsToInsert);

        return response()->json(['message' => 'Follow-up questions saved successfully']);
    }
}

