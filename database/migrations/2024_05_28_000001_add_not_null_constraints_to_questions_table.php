<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // First set default values for existing NULL entries
        DB::statement('UPDATE questions SET option_a = "Option A" WHERE option_a IS NULL');
        DB::statement('UPDATE questions SET option_b = "Option B" WHERE option_b IS NULL');
        DB::statement('UPDATE questions SET option_c = "Option C" WHERE option_c IS NULL');
        DB::statement('UPDATE questions SET option_d = "Option D" WHERE option_d IS NULL');
        DB::statement('UPDATE questions SET option_e = "Option E" WHERE option_e IS NULL');
        
        DB::statement('UPDATE questions SET score_a = 0 WHERE score_a IS NULL');
        DB::statement('UPDATE questions SET score_b = 0 WHERE score_b IS NULL');
        DB::statement('UPDATE questions SET score_c = 0 WHERE score_c IS NULL');
        DB::statement('UPDATE questions SET score_d = 0 WHERE score_d IS NULL');
        DB::statement('UPDATE questions SET score_e = 0 WHERE score_e IS NULL');

        // Then add NOT NULL constraints
        Schema::table('questions', function (Blueprint $table) {
            $table->string('option_a')->nullable(false)->change();
            $table->string('option_b')->nullable(false)->change();
            $table->string('option_c')->nullable(false)->change();
            $table->string('option_d')->nullable(false)->change();
            $table->string('option_e')->nullable(false)->change();
            
            $table->integer('score_a')->nullable(false)->change();
            $table->integer('score_b')->nullable(false)->change();
            $table->integer('score_c')->nullable(false)->change();
            $table->integer('score_d')->nullable(false)->change();
            $table->integer('score_e')->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('option_a')->nullable()->change();
            $table->string('option_b')->nullable()->change();
            $table->string('option_c')->nullable()->change();
            $table->string('option_d')->nullable()->change();
            $table->string('option_e')->nullable()->change();
            
            $table->integer('score_a')->nullable()->change();
            $table->integer('score_b')->nullable()->change();
            $table->integer('score_c')->nullable()->change();
            $table->integer('score_d')->nullable()->change();
            $table->integer('score_e')->nullable()->change();
        });
    }
};
