<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Account extends Model{
    protected $fillable = ["account_number", "account_type", "account_name", "balance", "available_balance", "currency"];

    public function user(){
        return $this->belongsTo(User::class);
    }
}