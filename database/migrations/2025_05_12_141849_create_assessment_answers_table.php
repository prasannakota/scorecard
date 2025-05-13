<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assessment_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assessment_id');
            $table->unsignedBigInteger('question_id');
            $table->string('selected_option')->nullable();
            $table->float('score')->default(0);

            $table->timestamps();

            // Foreign key constraints with no cascading delete
            $table->foreign('assessment_id')
                ->references('id')
                ->on('assessments')
                ->onDelete('restrict');

            $table->foreign('question_id')
                ->references('id')
                ->on('questions')
                ->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::dropIfExists('assessment_answers');
    }
};
