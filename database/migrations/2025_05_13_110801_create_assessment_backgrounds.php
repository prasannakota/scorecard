<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('assessment_backgrounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable();
            $table->integer('score')->nullable();
            $table->string('organization_name')->nullable();
            $table->string('website_url')->nullable();
            $table->string('industry_sector')->nullable();
            $table->string('annual_revenue')->nullable();
            $table->string('country')->nullable();
            $table->string('market_position')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('assessment_backgrounds');
    }
};
