<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('question_conditions', function (Blueprint $table) {
            $table->string('option')->nullable();
        });
    }

    public function down()
    {
        Schema::table('question_conditions', function (Blueprint $table) {
            $table->dropColumn('option');
        });
    }
};
