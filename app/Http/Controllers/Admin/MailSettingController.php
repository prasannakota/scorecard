<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailSetting;
use Illuminate\Http\Request;

class MailSettingController extends Controller {

    public function index() {
        $settings = MailSetting::pluck('value', 'key')->toArray();
        return view('admin.mail_settings.index', compact('settings'));
    }

    public function update(Request $request) {
        foreach ($request->except('_token') as $key => $value) {
            MailSetting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return back()->with('success', 'Mail settings updated!');
    }
}

