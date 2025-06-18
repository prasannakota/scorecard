<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ResetUserPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserAuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            if ($user->role === 'user') {
                $request->session()->regenerate();
                return redirect()->intended('dashboard'); // Changed from route('dashboard') to 'dashboard'
            }
            
            // Instead of logging out, redirect to admin login
            Auth::logout();
            return redirect()->route('admin.login')->with('warning', 'Please use the admin login page for admin accounts.');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function dashboard()
    {
        $user = auth()->user();
        $recentAssessments = $user->assessments()->latest()->take(5)->get();
        return view('user.dashboard', compact('recentAssessments'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }

    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'user',
        ]);

        Auth::login($user);
        return redirect()->route('dashboard');
    }

    public function showForgotPasswordForm()
    {
        return view('auth.passwords.email');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = \Illuminate\Foundation\Auth\SendsPasswordResetEmails::sendResetLinkEmail($request);

        return $status === \Illuminate\Foundation\Auth\SendsPasswordResetEmails::RESET_LINK_SENT
                    ? back()->with(['status' => __($status)])
                    : back()->withErrors(['email' => __($status)]);
    }

    public function showResetForm($token)
    {
        return view('auth.passwords.reset')->with(
            ['token' => $token]
        );
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = \Illuminate\Foundation\Auth\ResetsPasswords::reset($request);

        return $status === \Illuminate\Foundation\Auth\ResetsPasswords::PASSWORD_RESET
                    ? redirect()->route('login')->with('status', __($status))
                    : back()->withErrors(['email' => [__($status)]]);
    }


    public function showProfile()
    {
        $user = auth()->user();
        return view('user.profile', compact('user'));
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'mobile' => 'nullable|string|max:15',
        ]);

        // Combine first and last name
        $fullName = $request->input('first_name') . ' ' . $request->input('last_name');

        $user->update(
            [
                'name' => $fullName,
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'mobile' => $request->input('mobile'),
            ]
        );

        return redirect()->route('dashboard')->with('success', 'Profile updated successfully.');
    }

    public function generateResetToken(Request $request){
        $input = $request->all();

        //Validation for Store email
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        if(!$validated){
            return $this->sendError('Error validation', "Email field is required.");
        }
        //Checking for the Store User
        $whereFilter = [
            ['email', $input['email']]
        ];
        $user = User::where($whereFilter)->first();

        if($user){
            //Convert User Obj into array
            $userInfo = $user->toArray();

            //Generating a string of size 16
            $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            $token = substr(str_shuffle($chars),0,16);

            //Deleting previously created tokens
            $data = array('is_active' => 0, 'is_deleted' => 1);
            $delete = \DB::table('tbl_user_password_reset')
                ->where([
                    ['id', '=', $userInfo['id']],
                    ['is_active', '=', 1],
                    ['is_deleted', '=', 0]
                ])
                ->update($data);

            //Inserting token to DB
            $resetData = [
                'id' => $userInfo['id'],
                'email' => $input['email'],
                'token' => $token,
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ];
            $insertResetData = ResetUserPassword::insert($resetData);

            $app_url = env('APP_URL');

            $details = [
                'email' => $input['email'],
                'reset_link' => $app_url.'/password/reset/'.$token
            ];

            \Mail::to($input['email'])->send(new \App\Mail\ResetMail($details));

            if($insertResetData) {
                //Success Response
                $metaInfo = (object)array("message" => "success");
                return $this->sendResponse($insertResetData, $metaInfo);
            }
        }
        else{
            //User does not exist Error
            return $this->sendError('Unauthorised.', ['error'=>'Unauthorised']);
        }
    }
}
