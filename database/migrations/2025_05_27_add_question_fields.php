<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->enum('question_type', ['single_choice', 'multiple_choice', 'text', 'yes_no'])->default('single_choice');
            $table->integer('sequence_number')->nullable();
            $table->foreignId('next_question_id')->nullable()->constrained('questions');
            $table->string('condition_type')->nullable();
            $table->string('condition_value')->nullable();
        });
    }

    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['question_type', 'sequence_number', 'next_question_id', 'condition_type', 'condition_value']);
        });
    }
};
