<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('question_conditions', function (Blueprint $table) {
            $table->dropColumn('question_type');
        });
    }

    public function down()
    {
        Schema::table('question_conditions', function (Blueprint $table) {
            $table->enum('question_type', ['single_choice', 'multiple_choice', 'text', 'yes_no'])->default('single_choice');
        });
    }
};
