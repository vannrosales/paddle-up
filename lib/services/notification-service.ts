/**
 * Notification Service
 * Handles notification dispatches (email via Resend / webhook stub)
 * Designed for Phase 2 engagement: endorsements and new followers.
 */

export interface NotificationPayload {
  toEmail?: string;
  recipientName: string;
  senderName: string;
  type: "endorsement" | "new_follower";
  detail?: string;
}

export async function sendEmailNotification(payload: NotificationPayload): Promise<{ success: boolean; id?: string }> {
  // In development / demo mode or without RESEND_API_KEY, gracefully log the dispatch
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(`[PaddleUp Notification Stub] ${payload.type.toUpperCase()}:`, {
      to: payload.recipientName,
      from: payload.senderName,
      detail: payload.detail,
      timestamp: new Date().toISOString(),
    });
    return { success: true, id: `stub_${Date.now()}` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PaddleUp <notifications@paddleup.app>",
        to: payload.toEmail || "player@example.com",
        subject:
          payload.type === "endorsement"
            ? `${payload.senderName} endorsed your pickleball skills on PaddleUp!`
            : `${payload.senderName} is now following you on PaddleUp!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1C1C1E; background: #F2F2F7; border-radius: 16px;">
            <div style="background: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #E5E5EA;">
              <h2 style="margin-top: 0; color: #1C1C1E;">PaddleUp Notification</h2>
              <p style="font-size: 16px; line-height: 1.5;">Hi <strong>${payload.recipientName}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.5; color: #3A3A3C;">
                <strong>${payload.senderName}</strong> ${
                  payload.type === "endorsement"
                    ? `just gave you a peer endorsement: "<em>${payload.detail || "Skill & role vouch"}</em>"`
                    : "started following your tournament achievements and activity feed."
                }
              </p>
              <div style="margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" 
                   style="background: #C8F31D; color: #1C2A00; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 10px; display: inline-block;">
                  View on Dashboard
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.warn("Resend notification failed:", await res.text());
      return { success: false };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Failed to send notification email:", err);
    return { success: false };
  }
}

