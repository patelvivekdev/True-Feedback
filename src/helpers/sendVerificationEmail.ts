import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerificationEmail(email: string, username: string, verifyCode: string) {
  try {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    await resend.emails.send({
      from: 'no-reply@patelvivek.dev',
      to: email,
      subject: 'Verification Code',
      react: VerificationEmail({ BASE_URL, username, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
