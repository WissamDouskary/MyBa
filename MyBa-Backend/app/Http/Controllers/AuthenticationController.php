<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Account;


class AuthenticationController extends Controller
{
    public function register(Request $request)
    {

        $fields = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'profile_image_url' => 'nullable',
            'account_type' => "required|string",
            'initialDeposit' => "required|numeric"
        ]);

        $user = User::create([
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
            'first_name' => $fields['first_name'],
            'last_name' => $fields['last_name'],
            'phone' => $fields['phone'],
            'date_of_birth' => $fields['date_of_birth'],
            'address' => $fields['address'],
            'city' => $fields['city'],
            'state' => $fields['state'],
            'postal_code' => $fields['postal_code'],
            'country' => $fields['country'],
            'profile_image_url' => $fields['profile_image_url'],
        ]);

        $accountNumber = 'ACCT-' . strtoupper(uniqid());

        $account = $user->account()->create([
            'account_number' => $accountNumber,
            'account_type' => $fields["account_type"],
            'account_name' => $user->first_name . ' ' . $user->last_name,
            'balance' => $request["initialDeposit"],
            'available_balance' => $fields["initialDeposit"],
            'currency' => 'USD',
            'is_primary' => true,
            'is_active' => true,
        ]);

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'account' => $account
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        $token = $user->createToken("auth_token")->plainTextToken;
        $account = $user->account;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'account' => $account
        ], 200);
    }
}
