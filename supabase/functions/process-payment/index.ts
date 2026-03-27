import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface PaymentRequest {
  cart: CartItem[];
  total: number;
  paymentMethod: string;
  paymentGateway: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  couponCode?: string;
  discountAmount?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const paymentData: PaymentRequest = await req.json();
    const { cart, total, paymentMethod, paymentGateway, customerInfo, couponCode, discountAmount } = paymentData;

    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) throw orderNumberError;
    const orderNumber = orderNumberData;

    const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const tax = 0;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        subtotal,
        tax,
        total,
        coupon_code: couponCode || null,
        discount_amount: discountAmount || 0,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    if (couponCode && discountAmount) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', couponCode)
        .maybeSingle();

      if (coupon) {
        await supabase
          .from('coupon_usage')
          .insert({
            coupon_id: coupon.id,
            order_id: order.id,
            user_email: customerInfo.email,
            discount_applied: discountAmount,
            order_amount: subtotal
          });
      }
    }

    const orderItems = cart.map((item: CartItem) => ({
      order_id: order.id,
      service_id: item.id,
      service_name: item.name,
      service_description: item.description,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    let paymentUrl = '';
    let gatewayResponse: any = {};
    let transactionStatus = 'pending';

    const baseUrl = req.headers.get('origin') || 'http://localhost:5173';
    const successUrl = `${baseUrl}?page=confirmation`;
    const failedUrl = `${baseUrl}?page=payment`;

    if (paymentGateway === 'paymongo') {
      const paymongoSecretKey = Deno.env.get('PAYMONGO_SECRET_KEY');

      if (!paymongoSecretKey) {
        throw new Error('PayMongo API key not configured');
      }

      const authHeader = `Basic ${btoa(paymongoSecretKey + ':')}`;
      const amountInCentavos = Math.round(total * 100);

      // GCash and Maya use QRPh (Payment Intent workflow)
      if (paymentMethod === 'gcash' || paymentMethod === 'paymaya') {
        // Step 1: Create Payment Intent
        const paymentIntentResponse = await fetch('https://api.paymongo.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              attributes: {
                amount: amountInCentavos,
                payment_method_allowed: ['qrph'],
                currency: 'PHP',
                description: `Order ${orderNumber}`,
                statement_descriptor: 'BuildWithAldren'
              }
            }
          })
        });

        if (!paymentIntentResponse.ok) {
          const errorData = await paymentIntentResponse.text();
          throw new Error(`PayMongo Payment Intent error: ${errorData}`);
        }

        const paymentIntentData = await paymentIntentResponse.json();
        const paymentIntentId = paymentIntentData.data.id;

        // Step 2: Create QRPh Payment Method
        const paymentMethodResponse = await fetch('https://api.paymongo.com/v1/payment_methods', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              attributes: {
                type: 'qrph',
                billing: {
                  name: customerInfo.name,
                  email: customerInfo.email,
                  phone: customerInfo.phone
                }
              }
            }
          })
        });

        if (!paymentMethodResponse.ok) {
          const errorData = await paymentMethodResponse.text();
          throw new Error(`PayMongo Payment Method error: ${errorData}`);
        }

        const paymentMethodData = await paymentMethodResponse.json();
        const paymentMethodId = paymentMethodData.data.id;

        // Step 3: Attach Payment Method to Payment Intent
        const attachResponse = await fetch(`https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              attributes: {
                payment_method: paymentMethodId,
                return_url: successUrl
              }
            }
          })
        });

        if (!attachResponse.ok) {
          const errorData = await attachResponse.text();
          throw new Error(`PayMongo Attach error: ${errorData}`);
        }

        const attachData = await attachResponse.json();
        gatewayResponse = attachData;

        // QR code image URL is in next_action.code.image_url (base64 encoded)
        const qrCodeUrl = attachData.data.attributes.next_action?.code?.image_url;

        if (qrCodeUrl) {
          // Return QR code to display to customer
          paymentUrl = qrCodeUrl;
        } else {
          paymentUrl = successUrl;
        }

      } else if (paymentMethod === 'card') {
        const paymentIntentResponse = await fetch('https://api.paymongo.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              attributes: {
                amount: amountInCentavos,
                payment_method_allowed: ['card'],
                payment_method_options: {
                  card: { request_three_d_secure: 'any' }
                },
                currency: 'PHP',
                description: `Order ${orderNumber}`,
                statement_descriptor: 'BuildWithAldren'
              }
            }
          })
        });

        if (!paymentIntentResponse.ok) {
          const errorData = await paymentIntentResponse.text();
          throw new Error(`PayMongo API error: ${errorData}`);
        }

        const paymentIntentData = await paymentIntentResponse.json();
        gatewayResponse = paymentIntentData;
        paymentUrl = paymentIntentData.data.attributes.next_action?.redirect?.url || successUrl;

      } else {
        const sourceResponse = await fetch('https://api.paymongo.com/v1/sources', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              attributes: {
                type: sourceType,
                amount: amountInCentavos,
                currency: 'PHP',
                redirect: {
                  success: successUrl,
                  failed: failedUrl
                },
                billing: {
                  name: customerInfo.name,
                  email: customerInfo.email,
                  phone: customerInfo.phone
                }
              }
            }
          })
        });

        if (!sourceResponse.ok) {
          const errorData = await sourceResponse.text();
          let parsedError;
          try {
            parsedError = JSON.parse(errorData);
          } catch {
            throw new Error(`PayMongo API error: ${errorData}`);
          }

          if (parsedError.errors && parsedError.errors[0]) {
            const error = parsedError.errors[0];
            if (error.code === 'payment_method_not_configured') {
              throw new Error(
                `Payment method not enabled. Please enable ${paymentMethod.toUpperCase()} in your PayMongo dashboard:\n` +
                `1. Go to https://dashboard.paymongo.com\n` +
                `2. Navigate to Settings > Payment Methods\n` +
                `3. Enable ${paymentMethod.toUpperCase()} payment option\n` +
                `4. Complete verification if required`
              );
            }
            throw new Error(`PayMongo error: ${error.detail || error.code}`);
          }
          throw new Error(`PayMongo API error: ${errorData}`);
        }

        const sourceData = await sourceResponse.json();
        gatewayResponse = sourceData;
        paymentUrl = sourceData.data.attributes.redirect.checkout_url;
      }

    } else if (paymentGateway === 'xendit') {
      const xenditSecretKey = Deno.env.get('XENDIT_SECRET_KEY');

      if (!xenditSecretKey) {
        throw new Error('Xendit API key not configured');
      }

      const authHeader = `Basic ${btoa(xenditSecretKey + ':')}`;

      const ewalletResponse = await fetch('https://api.xendit.co/ewallets/charges', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reference_id: transactionId,
          currency: 'PHP',
          amount: total,
          checkout_method: 'ONE_TIME_PAYMENT',
          channel_code: 'SHOPEEPAY',
          channel_properties: {
            success_redirect_url: successUrl,
            failure_redirect_url: failedUrl
          },
          metadata: {
            order_number: orderNumber,
            customer_name: customerInfo.name
          }
        })
      });

      if (!ewalletResponse.ok) {
        const errorData = await ewalletResponse.text();
        throw new Error(`Xendit API error: ${errorData}`);
      }

      const ewalletData = await ewalletResponse.json();
      gatewayResponse = ewalletData;
      paymentUrl = ewalletData.actions?.desktop_web_checkout_url || ewalletData.actions?.mobile_web_checkout_url;

    } else if (paymentGateway === 'paypal') {
      const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
      const paypalSecret = Deno.env.get('PAYPAL_SECRET');

      if (!paypalClientId || !paypalSecret) {
        throw new Error('PayPal credentials not configured');
      }

      const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(paypalClientId + ':' + paypalSecret)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!authResponse.ok) {
        throw new Error('PayPal authentication failed');
      }

      const { access_token } = await authResponse.json();

      const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            reference_id: orderNumber,
            amount: {
              currency_code: 'PHP',
              value: total.toFixed(2)
            },
            description: `Order ${orderNumber}`
          }],
          application_context: {
            return_url: successUrl,
            cancel_url: failedUrl,
            brand_name: 'Build with Aldren',
            user_action: 'PAY_NOW'
          }
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.text();
        throw new Error(`PayPal API error: ${errorData}`);
      }

      const paypalOrderData = await orderResponse.json();
      gatewayResponse = paypalOrderData;
      const approveLink = paypalOrderData.links.find((link: any) => link.rel === 'approve');
      paymentUrl = approveLink ? approveLink.href : successUrl;
    }

    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        order_id: order.id,
        transaction_id: transactionId,
        payment_method: paymentMethod,
        payment_gateway: paymentGateway,
        amount: total,
        currency: 'PHP',
        status: transactionStatus,
        gateway_response: gatewayResponse
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    await supabase
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order.id);

    await supabase
      .from('transactions')
      .update({ status: 'success' })
      .eq('id', transaction.id);

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber,
        transactionId,
        paymentUrl,
        requiresRedirect: !!paymentUrl,
        message: 'Order created successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Payment processing error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred processing your payment'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
