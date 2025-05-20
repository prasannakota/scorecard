<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->enum('revenue_range', ['5m', '5-10m', '10m+'])->default('5m');
            $table->boolean('is_active')->default(true);
        });
    }

    public function down()
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
            $table->dropColumn(['department_id', 'revenue_range', 'is_active']);
        });
    }
};
