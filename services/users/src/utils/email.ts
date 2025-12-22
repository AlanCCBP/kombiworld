/**
 * Utilidad para envío de emails
 * 
 * TODO: Implementar con un servicio real como:
 * - Nodemailer con SMTP
 * - SendGrid
 * - AWS SES
 * - Resend
 * 
 * Por ahora solo loguea en consola para desarrollo
 */

export const sendPasswordResetEmail = async (
  email: string,
  userName: string,
  resetUrl: string
): Promise<void> => {
  // TODO: Implementar envío real de email
  console.log(`
    =====================================
    📧 Password Reset Email
    =====================================
    To: ${email}
    Subject: Reset your password
    
    Hi ${userName},
    
    You requested to reset your password. Click the link below to reset it:
    
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    =====================================
  `);

  // Ejemplo con Nodemailer (comentado):
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Reset your password</h1>
      <p>Hi ${userName},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
  */
};

export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<void> => {
  console.log(`
    =====================================
    📧 Welcome Email
    =====================================
    To: ${email}
    Subject: Welcome to KombiWorld!
    
    Hi ${userName},
    
    Welcome to KombiWorld! Your account has been created successfully.
    
    You can now start booking your trips.
    
    =====================================
  `);
};

export const sendBookingConfirmationEmail = async (
  email: string,
  bookingDetails: any
): Promise<void> => {
  console.log(`
    =====================================
    📧 Booking Confirmation
    =====================================
    To: ${email}
    Subject: Your booking has been confirmed
    
    Your booking has been confirmed!
    
    Details:
    ${JSON.stringify(bookingDetails, null, 2)}
    
    =====================================
  `);
};
