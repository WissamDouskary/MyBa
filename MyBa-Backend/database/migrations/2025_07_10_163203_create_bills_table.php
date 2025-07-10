<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('biller_name', 200);
            $table->string('bill_type', 100); // electricity, water, internet, phone, etc.
            $table->string('account_number', 100);
            $table->decimal('amount', 15, 2)->nullable();
            $table->date('due_date')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurring_frequency', ['weekly', 'monthly', 'quarterly', 'yearly'])->nullable();
            $table->boolean('auto_pay')->default(false);
            $table->foreignId('auto_pay_account_id')->nullable()->constrained('accounts')->onDelete('set null');
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending');
            $table->timestamps();
            
            $table->index('user_id');
            $table->index(['user_id', 'status']);
            $table->index('due_date');
            $table->index(['user_id', 'due_date']);
            $table->index('auto_pay_account_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('bills');
    }
};