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
        Schema::table('project_user', function (Blueprint $table) {
            $table->unsignedBigInteger('token_quota')->nullable()->after('role'); // null = unlimited for this project
            $table->unsignedBigInteger('token_used')->default(0)->after('token_quota');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_user', function (Blueprint $table) {
            $table->dropColumn(['token_quota', 'token_used']);
        });
    }
};
