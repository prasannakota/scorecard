<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void {
        Schema::create('options', function (Blueprint $table) {
            $table->id(); // OptionId
            $table->string('option_text');
            $table->integer('option_score')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('options');
    }
};
