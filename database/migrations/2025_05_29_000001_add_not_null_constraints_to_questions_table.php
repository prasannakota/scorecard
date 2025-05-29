<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // First set default values for existing NULL entries using Laravel's query builder
        DB::table('questions')
            ->whereNull('option_a')
            ->update(['option_a' => 'Option A']);
        
        DB::table('questions')
            ->whereNull('option_b')
            ->update(['option_b' => 'Option B']);
        
        DB::table('questions')
            ->whereNull('option_c')
            ->update(['option_c' => 'Option C']);
        
        DB::table('questions')
            ->whereNull('option_d')
            ->update(['option_d' => 'Option D']);
        
        DB::table('questions')
            ->whereNull('option_e')
            ->update(['option_e' => 'Option E']);
        
        DB::table('questions')
            ->whereNull('score_a')
            ->update(['score_a' => 0]);
        
        DB::table('questions')
            ->whereNull('score_b')
            ->update(['score_b' => 0]);
        
        DB::table('questions')
            ->whereNull('score_c')
            ->update(['score_c' => 0]);
        
        DB::table('questions')
            ->whereNull('score_d')
            ->update(['score_d' => 0]);
        
        DB::table('questions')
            ->whereNull('score_e')
            ->update(['score_e' => 0]);

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
