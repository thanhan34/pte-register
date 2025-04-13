import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
// In production, this should be set as an environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY';
sgMail.setApiKey(SENDGRID_API_KEY);

interface EmailData {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email using SendGrid
 * @param emailData The email data to send
 * @returns A promise that resolves when the email is sent
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    await sgMail.send(emailData);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send a registration notification email to the admin
 * @param studentData The student data to include in the notification
 * @returns A promise that resolves when the email is sent
 */
export async function sendRegistrationNotification(studentData: any): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pteintensive.com';
  const fromEmail = process.env.FROM_EMAIL || 'admin@pteintensive.com';
  
  const emailData: EmailData = {
    to: adminEmail,
    from: fromEmail,
    subject: 'New Student Registration',
    text: `
      A new student has registered:
      
      Name: ${studentData.name}
      Phone: ${studentData.phone}
      Date of Birth: ${studentData.dob}
      Province: ${studentData.province}
      Target Score: ${studentData.targetScore}
      Tuition Fee: ${studentData.tuitionFee.toLocaleString('vi-VN')} VND
    `,
    html: `
      <h2>New Student Registration</h2>
      <p>A new student has registered:</p>
      <ul>
        <li><strong>Name:</strong> ${studentData.name}</li>
        <li><strong>Phone:</strong> ${studentData.phone}</li>
        <li><strong>Date of Birth:</strong> ${studentData.dob}</li>
        <li><strong>Province:</strong> ${studentData.province}</li>
        <li><strong>Target Score:</strong> ${studentData.targetScore}</li>
        <li><strong>Tuition Fee:</strong> ${studentData.tuitionFee.toLocaleString('vi-VN')} VND</li>
      </ul>
    `
  };
  
  return sendEmail(emailData);
}
