<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('follow_up_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('option_id');
            $table->unsignedBigInteger('follow_up_question_id'); // references questions.id
            $table->timestamps();

            $table->foreign('option_id')->references('id')->on('options')->onDelete('cascade');
            $table->foreign('follow_up_question_id')->references('id')->on('questions')->onDelete('cascade');

            $table->unique(['option_id', 'follow_up_question_id'], 'option_followup_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follow_up_questions');
    }
};
