import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1450507225503240334/XJj0LAYcGMD0N2AThCG2KoNfQSZtgA9T3AQIJigj6PHIGSR2LwaWBgR15OfLqMUNnO1N';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Format tuition fee to Vietnamese currency
    const formatVND = (value: number): string => {
      return value.toLocaleString('vi-VN') + ' VNĐ';
    };
    
    // Create Discord embed message
    const discordMessage = {
      embeds: [{
        title: '🎓 Đăng Ký Học Viên Mới',
        color: 0xfc5d01, // Orange color
        fields: [
          {
            name: '👤 Họ và tên',
            value: data.name || 'N/A',
            inline: true
          },
          {
            name: '📞 Số điện thoại',
            value: data.phone || 'N/A',
            inline: true
          },
          {
            name: '🎂 Ngày sinh',
            value: data.dob || 'N/A',
            inline: true
          },
          {
            name: '📍 Tỉnh/Thành phố',
            value: data.province || 'N/A',
            inline: true
          },
          {
            name: '🎯 Điểm mục tiêu',
            value: data.targetScore?.toString() || 'N/A',
            inline: true
          },
          {
            name: '💰 Học phí',
            value: data.tuitionFee ? formatVND(data.tuitionFee) : 'N/A',
            inline: true
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'PTE Intensive - Hệ thống đăng ký học viên'
        }
      }]
    };
    
    // Send to Discord webhook
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    });
    
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Discord notification sent successfully' 
      });
    } else {
      const errorText = await response.text();
      console.error('Discord webhook error:', errorText);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to send Discord notification' 
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
