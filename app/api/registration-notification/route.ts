import { NextResponse } from 'next/server';
import { sendRegistrationNotification } from '../../utils/emailService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Send email notification to admin
    const emailSent = await sendRegistrationNotification(data);
    
    if (emailSent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Notification email sent successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send notification email' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing registration notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process notification' },
      { status: 500 }
    );
  }
}
