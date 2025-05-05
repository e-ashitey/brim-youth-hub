"use server"

interface NotificationData {
  userId: string
  userName: string
  requestId: string
  reason: string
}

export async function sendAdminNotification(data: NotificationData) {
  // In a real application, you would use a service like Resend, SendGrid, etc.
  // For this example, we'll just log the notification
  console.log("Admin notification would be sent with the following data:", {
    subject: `Update Request from ${data.userName}`,
    body: `
      User ${data.userName} (ID: ${data.userId}) has requested an update to their information.
      
      Request ID: ${data.requestId}
      Reason: ${data.reason}
      
      Please review this request in the admin dashboard.
    `,
  })

  // Simulate a successful email send
  return { success: true }
}
