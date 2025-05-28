<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('question_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->enum('question_type', ['single_choice', 'multiple_choice', 'text', 'yes_no'])->default('single_choice');
            $table->integer('sequence_number')->nullable();
            $table->foreignId('next_question_id')->nullable()->constrained('questions');
            $table->string('condition_type')->nullable();
            $table->string('condition_value')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('question_conditions');
    }
};
