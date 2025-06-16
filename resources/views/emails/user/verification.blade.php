@component('mail::message')
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
    <tr>
        <td align="center" style="padding: 20px 0;">
            <img src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif" width="200" style="display: block;" alt="{{ config('app.name') }} Logo">
        </td>
    </tr>
</table>

<h2 style="text-align: center; color: #333; margin-bottom: 20px; font-size: 24px; font-weight: bold;">
    Welcome to {{ config('app.name') }}
</h2>

<p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
    Hello {{ $user->first_name }},
</p>

<p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
    Thank you for registering with {{ config('app.name') }}! To complete your registration, please verify your email address by clicking the button below.
</p>

@component('mail::button', ['url' => $verificationUrl, 'color' => 'blue'])
Verify Email Address
@endcomponent

<p style="margin-top: 20px; color: #666; font-size: 14px; line-height: 1.6;">
    If you did not create an account, no further action is required.
</p>

<p style="margin-top: 20px; text-align: center; color: #666; font-size: 14px; line-height: 1.6;">
    Best regards,<br>
    The {{ config('app.name') }} Team
</p>
@endcomponent
