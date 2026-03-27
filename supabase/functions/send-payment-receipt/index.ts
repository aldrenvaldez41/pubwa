import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface ReceiptData {
  orderNumber: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  discount?: number;
  couponCode?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const receiptData: ReceiptData = await req.json();
    const { orderNumber, transactionId, customerName, customerEmail, paymentMethod, cart, subtotal, tax, total, discount, couponCode } = receiptData;

    // Input validation
    if (!orderNumber || !transactionId || !customerEmail || !cart || cart.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const ownerEmail = Deno.env.get("OWNER_EMAIL") || "hello@buildwithaldren.com";

    if (!brevoApiKey) {
      throw new Error("Brevo API key not configured");
    }

    // Sanitize inputs
    const sanitize = (str: string) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const sanitizedName = sanitize(customerName);
    const sanitizedEmail = sanitize(customerEmail);

    // Payment method display names
    const paymentMethodNames: { [key: string]: string } = {
      'gcash': 'GCash',
      'paymaya': 'Maya (PayMaya)',
      'grab_pay': 'GrabPay',
      'shopeepay': 'ShopeePay',
      'billease': 'BillEase',
      'dob': 'BPI Online Banking',
      'ubp': 'UnionBank Online Banking',
      'card': 'Credit/Debit Card',
      'paypal': 'PayPal'
    };

    const paymentMethodDisplay = paymentMethodNames[paymentMethod] || paymentMethod;

    // Generate order items HTML
    const orderItemsHtml = cart.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #1e293b;">${sanitize(item.name)}</strong><br/>
          <span style="color: #64748b; font-size: 14px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b;">₱${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    // Customer receipt email
    const customerEmail = {
      sender: { email: ownerEmail, name: "Build with Aldren" },
      to: [{ email: sanitizedEmail, name: sanitizedName }],
      subject: `Payment Confirmation - Order ${orderNumber}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✓ Payment Successful!</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Thank you for your order</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Hi ${sanitizedName},</h2>
            <p style="color: #475569; line-height: 1.6;">
              Your payment has been successfully processed! Below is your receipt and order details.
            </p>

            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Order Number</td>
                  <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: bold;">${orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Transaction ID</td>
                  <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: bold; font-family: monospace; font-size: 12px;">${transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Payment Method</td>
                  <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: bold;">${paymentMethodDisplay}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date</td>
                  <td style="padding: 8px 0; text-align: right; color: #1e293b; font-weight: bold;">${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              </table>
            </div>

            <h3 style="color: #1e293b; margin-top: 30px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 12px; text-align: left; color: #475569; font-weight: 600;">Item</th>
                  <th style="padding: 12px; text-align: right; color: #475569; font-weight: 600;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #1e293b;">₱${subtotal.toLocaleString()}</td>
                </tr>
                ${discount && discount > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #10b981;">Discount${couponCode ? ` (${couponCode})` : ''}</td>
                  <td style="padding: 8px 0; text-align: right; color: #10b981;">-₱${discount.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Tax</td>
                  <td style="padding: 8px 0; text-align: right; color: #1e293b;">₱${tax.toLocaleString()}</td>
                </tr>
                <tr style="border-top: 2px solid #cbd5e1;">
                  <td style="padding: 12px 0; color: #1e293b; font-size: 18px; font-weight: bold;">Total Paid</td>
                  <td style="padding: 12px 0; text-align: right; color: #10b981; font-size: 20px; font-weight: bold;">₱${total.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin: 25px 0;">
              <p style="margin: 0; color: #1e40af; line-height: 1.6;">
                <strong>What's Next?</strong><br/>
                We'll start working on your project shortly. You'll receive updates via email. If you have any questions, feel free to reply to this email.
              </p>
            </div>

            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              Thank you for choosing Build with Aldren!
            </p>
          </div>

          <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
            <p>Build with Aldren | Full Stack Development</p>
            <p>${ownerEmail} | 09161171825</p>
          </div>
        </div>
      `,
    };

    // Owner notification email
    const ownerNotificationEmail = {
      sender: { email: ownerEmail, name: "Build with Aldren Payment System" },
      to: [{ email: ownerEmail, name: "Aldren" }],
      subject: `New Order: ${orderNumber} - ₱${total.toLocaleString()}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <h2 style="color: #1e293b; margin-bottom: 20px;">🎉 New Order Received!</h2>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="background-color: #10b981; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
              <h3 style="margin: 0; font-size: 24px;">₱${total.toLocaleString()}</h3>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Total Amount</p>
            </div>

            <h3 style="color: #1e293b; margin-top: 20px;">Order Information</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Order Number:</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #1e293b; font-family: monospace; font-size: 12px;">${transactionId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Payment Method:</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: bold;">${paymentMethodDisplay}</td>
              </tr>
            </table>

            <h3 style="color: #1e293b; margin-top: 25px;">Customer Details</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px;">
              <p style="margin: 5px 0; color: #1e293b;"><strong>Name:</strong> ${sanitizedName}</p>
              <p style="margin: 5px 0; color: #1e293b;"><strong>Email:</strong> ${sanitizedEmail}</p>
            </div>

            <h3 style="color: #1e293b; margin-top: 25px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>

            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 20px;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0; color: #64748b;">Subtotal:</td>
                  <td style="padding: 5px 0; text-align: right; color: #1e293b;">₱${subtotal.toLocaleString()}</td>
                </tr>
                ${discount && discount > 0 ? `
                <tr>
                  <td style="padding: 5px 0; color: #10b981;">Discount${couponCode ? ` (${couponCode})` : ''}:</td>
                  <td style="padding: 5px 0; text-align: right; color: #10b981;">-₱${discount.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 5px 0; color: #64748b;">Tax:</td>
                  <td style="padding: 5px 0; text-align: right; color: #1e293b;">₱${tax.toLocaleString()}</td>
                </tr>
                <tr style="border-top: 2px solid #cbd5e1;">
                  <td style="padding: 10px 0; color: #1e293b; font-weight: bold;">Total:</td>
                  <td style="padding: 10px 0; text-align: right; color: #10b981; font-weight: bold; font-size: 18px;">₱${total.toLocaleString()}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails via Brevo API
    const brevoEndpoint = "https://api.brevo.com/v3/smtp/email";
    const headers = {
      "accept": "application/json",
      "api-key": brevoApiKey,
      "content-type": "application/json",
    };

    // Send customer receipt
    const customerResponse = await fetch(brevoEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(customerEmail),
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error("Brevo customer email error:", errorText);
      throw new Error(`Failed to send customer receipt: ${customerResponse.status}`);
    }

    // Send owner notification
    const ownerResponse = await fetch(brevoEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(ownerNotificationEmail),
    });

    if (!ownerResponse.ok) {
      const errorText = await ownerResponse.text();
      console.error("Brevo owner notification error:", errorText);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Receipt sent successfully" }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-payment-receipt function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});