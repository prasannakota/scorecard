<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            if (!Schema::hasColumn('questions', 'question_type')) {
                $table->enum('question_type', ['single_choice', 'multiple_choice', 'text', 'yes_no'])->default('single_choice');
            }
            if (!Schema::hasColumn('questions', 'sequence_number')) {
                $table->integer('sequence_number')->nullable();
            }
            if (!Schema::hasColumn('questions', 'next_question_id')) {
                $table->foreignId('next_question_id')->nullable()->constrained('questions');
            }
            if (!Schema::hasColumn('questions', 'condition_type')) {
                $table->string('condition_type')->nullable();
            }
            if (!Schema::hasColumn('questions', 'condition_value')) {
                $table->string('condition_value')->nullable();
            }
        });
    }

    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['question_type', 'sequence_number', 'next_question_id', 'condition_type', 'condition_value']);
        });
    }
};
