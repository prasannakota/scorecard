<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller {

    public function index() {
        $templates = EmailTemplate::all();
        return view('admin.email_templates.index', compact('templates'));
    }

    public function create() {
        return view('admin.email_templates.create');
    }

    public function store(Request $request) {
        EmailTemplate::create($request->only(['name', 'slug', 'subject', 'body']));
        return redirect()->route('admin.email_templates.index')->with('success', 'Email Template created successfully!');
    }

    public function edit(EmailTemplate $emailTemplate) {
        return view('admin.email_templates.edit', compact('emailTemplate'));
    }

    public function update(Request $request, EmailTemplate $emailTemplate) {
        $emailTemplate->update($request->only(['name', 'slug', 'subject', 'body']));
        return redirect()->route('admin.email_templates.index')->with('success', 'Email Template updated successfully!');
    }

    public function destroy(EmailTemplate $emailTemplate) {
        $emailTemplate->delete();
        return redirect()->route('admin.email_templates.index')->with('success', 'Email Template deleted successfully!');
    }
}

