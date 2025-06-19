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
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn([
                'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'option_f',
                'score_a', 'score_b', 'score_c', 'score_d', 'score_e', 'score_f',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('option_a');
            $table->string('option_b');
            $table->string('option_c');
            $table->string('option_d');
            $table->string('option_e');
            $table->string('option_f')->default('Option F');

            $table->integer('score_a');
            $table->integer('score_b');
            $table->integer('score_c');
            $table->integer('score_d');
            $table->integer('score_e');
            $table->integer('score_f')->default(0);
        });
    }
};
