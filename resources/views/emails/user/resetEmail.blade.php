<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <img src="https://cdn.prod.website-files.com/664c3c71d7e537047464d70b/664eb3db1955b085f0f26768_Kensium%20Solutions%20Horizontal%20%20logo-blue%201.avif" width="200" style="display: block;" alt="{{ config('app.name') }} Logo">
            </td>
        </tr>
    </table>
    <p style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
        Hello {{ $details['name'] }},
    </p>
    <p>Someone has requested a link to change your password.</p>
    <p>To update your password, click the link below: If you cannot see the link, please copy this URL into your web browser:</p>
    <p>{{ $details['reset_link'] }}</p>
</body>
</html>
