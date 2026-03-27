import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ValidateCouponRequest {
  couponCode: string;
  userEmail: string;
  orderAmount: number;
  serviceIds?: string[];
}

interface CouponValidationResult {
  valid: boolean;
  coupon?: any;
  discountAmount?: number;
  finalAmount?: number;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { couponCode, userEmail, orderAmount, serviceIds = [] }: ValidateCouponRequest = await req.json();

    if (!couponCode || !userEmail || !orderAmount) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'Missing required fields'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .maybeSingle();

    if (couponError || !coupon) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'Invalid coupon code'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!coupon.is_active) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'This coupon is no longer active'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const expirationDate = coupon.expiration_date ? new Date(coupon.expiration_date) : null;

    if (now < startDate) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'This coupon is not yet active'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (expirationDate && now > expirationDate) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'This coupon has expired'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (coupon.min_purchase_amount && orderAmount < coupon.min_purchase_amount) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: `Minimum purchase amount of ₱${coupon.min_purchase_amount.toLocaleString()} required`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (coupon.user_specific && coupon.user_specific !== userEmail) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'This coupon is not valid for your account'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (coupon.applicable_services && coupon.applicable_services.length > 0) {
      const hasApplicableService = serviceIds.some(id =>
        coupon.applicable_services.includes(id)
      );

      if (!hasApplicableService) {
        return new Response(
          JSON.stringify({
            valid: false,
            message: 'This coupon is not applicable to the selected services'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    const { data: usageData } = await supabase
      .from('coupon_usage')
      .select('id')
      .eq('coupon_id', coupon.id);

    const totalUsageCount = usageData?.length || 0;

    if (coupon.usage_limit && totalUsageCount >= coupon.usage_limit) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'This coupon has reached its usage limit'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: userUsageData } = await supabase
      .from('coupon_usage')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_email', userEmail);

    const userUsageCount = userUsageData?.length || 0;

    if (coupon.usage_limit_per_user && userUsageCount >= coupon.usage_limit_per_user) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'You have already used this coupon the maximum number of times'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (coupon.is_single_use && totalUsageCount > 0) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'This coupon has already been used'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let discountAmount = 0;

    switch (coupon.discount_type) {
      case 'percentage':
        discountAmount = (orderAmount * coupon.discount_value) / 100;
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
        break;

      case 'fixed_amount':
        discountAmount = Math.min(coupon.discount_value, orderAmount);
        break;

      case 'free_shipping':
        discountAmount = 0;
        break;

      case 'bogo':
        discountAmount = orderAmount / 2;
        break;

      default:
        discountAmount = 0;
    }

    const finalAmount = Math.max(0, orderAmount - discountAmount);

    return new Response(
      JSON.stringify({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          discount_type: coupon.discount_type,
        },
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalAmount: Math.round(finalAmount * 100) / 100,
        message: 'Coupon applied successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error validating coupon:', error);
    return new Response(
      JSON.stringify({
        valid: false,
        message: 'An error occurred while validating the coupon'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
