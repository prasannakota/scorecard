<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('questions');
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->enum('revenue_range', ['5m', '5-10m', '10m+'])->default('5m');
            $table->text('question_text');
            $table->enum('question_type', ['single_choice', 'multiple_choice', 'text', 'yes_no'])->default('single_choice');
            $table->integer('sequence_number')->nullable();
            $table->foreignId('next_question_id')->nullable()->constrained('questions');
            $table->string('condition_type')->nullable();
            $table->string('condition_value')->nullable();
            $table->string('option_a');
            $table->string('option_b');
            $table->string('option_c')->nullable();
            $table->string('option_d')->nullable();
            $table->string('option_e')->nullable();
            $table->float('score_a');
            $table->float('score_b');
            $table->float('score_c')->nullable();
            $table->float('score_d')->nullable();
            $table->float('score_e')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('questions');
    }
};
