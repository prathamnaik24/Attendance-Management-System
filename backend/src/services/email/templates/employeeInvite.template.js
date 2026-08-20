export const generateEmployeeInviteEmail = (payload) => {
  const { employeeName, organizationName, inviteUrl } = payload;
  
  const subject = `You're invited to join ${organizationName} on Haazri`;
  
  const text = `
Hello ${employeeName},

You've been invited to join ${organizationName} on Haazri.

Activate your account using this link:
${inviteUrl}

This link expires in 24 hours.

If you were not expecting this invitation, you can safely ignore this email.
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #172B3A; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 8px; text-align: center; }
    .btn { display: inline-block; background-color: #1677B8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="color: #1677B8; margin: 0;">Haazri</h2>
    </div>
    <div class="content">
      <h3 style="margin-top: 0;">Hello ${employeeName},</h3>
      <p>You've been invited to join <strong>${organizationName}</strong> on Haazri.</p>
      
      <a href="${inviteUrl}" class="btn">Activate My Account</a>
      
      <p style="font-size: 13px; color: #6b7280;">This link expires in 24 hours.</p>
    </div>
    <div class="footer">
      If you were not expecting this invitation, you can safely ignore this email.<br>
      Powered by Haazri
    </div>
  </div>
</body>
</html>
`;

  return { subject, text, html };
};
