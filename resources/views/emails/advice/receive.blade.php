@component('mail::message')
    # New Advice Submission

    **Name:** {{ $Advice->first_name }} {{ $Advice->last_name }}

    **Email:** {{ $Advice->email }}

    **Subject:** {{ $Advice->subject }}

    **Category:** {{ $Advice->category }}

    **Priority:** {{ $Advice->priority }}

    **Message:**
    {{ $Advice->message }}

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
