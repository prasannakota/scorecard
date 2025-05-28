@component('mail::message')
    # You're Invited!

    Click below to join:

    @component('mail::button', ['url' => route('invites.accept', ['token' => $invite->token])])
        Accept Invitation
    @endcomponent
    <a href="{{ route('invites.accept', ['token' => $invite->token]) }}">Accept Invitation</a>


    This link will expire on {{ $invite->expires_at->format('M d, Y') }}.

    Thanks,
    {{ config('app.name') }}
@endcomponent
