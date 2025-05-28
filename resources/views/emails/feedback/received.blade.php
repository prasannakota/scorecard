@component('mail::message')
    # New Feedback Received

    **Name:** {{ $feedback->first_name }} {{ $feedback->last_name }}

    **Email:** {{ $feedback->email }}

    **Rating:** {{ $feedback->rating }}

    **Feedback:**
    {{ $feedback->feedback }}

    **Consent to contact:** {{ $feedback->consent ? 'Yes' : 'No' }}

    Thanks,
    {{ config('app.name') }}
@endcomponent
