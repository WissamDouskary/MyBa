<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained()->onDelete('cascade');
            $table->enum('transaction_type', ['debit', 'credit', 'transfer']);
            $table->decimal('amount', 15, 2);
            $table->decimal('balance_after', 15, 2);
            $table->text('description')->nullable();
            $table->string('category', 100)->nullable();
            $table->string('reference_number', 100)->unique()->nullable();
            $table->foreignId('recipient_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->string('recipient_name', 200)->nullable();
            $table->string('recipient_bank', 200)->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed');
            $table->timestamp('transaction_date')->useCurrent();
            $table->timestamps();
            
            // Indexes
            $table->index('account_id');
            $table->index('transaction_date');
            $table->index(['account_id', 'transaction_date']);
            $table->index('reference_number');
            $table->index(['account_id', 'status']);
            $table->index('recipient_account_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};