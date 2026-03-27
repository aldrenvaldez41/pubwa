import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'create':
        return await createCoupon(req, supabase);

      case 'update':
        return await updateCoupon(req, supabase);

      case 'delete':
        return await deleteCoupon(req, supabase);

      case 'list':
        return await listCoupons(req, supabase);

      case 'record-usage':
        return await recordUsage(req, supabase);

      case 'analytics':
        return await getCouponAnalytics(req, supabase);

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (error) {
    console.error('Error in manage-coupons:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function createCoupon(req: Request, supabase: any) {
  const body = await req.json();

  const { data, error } = await supabase
    .from('coupons')
    .insert({
      code: body.code.toUpperCase(),
      description: body.description,
      discount_type: body.discount_type,
      discount_value: body.discount_value,
      min_purchase_amount: body.min_purchase_amount || null,
      max_discount_amount: body.max_discount_amount || null,
      start_date: body.start_date || new Date().toISOString(),
      expiration_date: body.expiration_date || null,
      usage_limit: body.usage_limit || null,
      usage_limit_per_user: body.usage_limit_per_user || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
      is_single_use: body.is_single_use || false,
      user_specific: body.user_specific || null,
      applicable_services: body.applicable_services || null,
      created_by: body.created_by || null,
    })
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, coupon: data }),
    {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function updateCoupon(req: Request, supabase: any) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (updates.code) {
    updates.code = updates.code.toUpperCase();
  }

  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, coupon: data }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function deleteCoupon(req: Request, supabase: any) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: 'Coupon deleted successfully' }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function listCoupons(req: Request, supabase: any) {
  const url = new URL(req.url);
  const activeOnly = url.searchParams.get('active') === 'true';

  let query = supabase.from('coupons').select('*').order('created_at', { ascending: false });

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, coupons: data }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function recordUsage(req: Request, supabase: any) {
  const body = await req.json();

  const { data, error } = await supabase
    .from('coupon_usage')
    .insert({
      coupon_id: body.coupon_id,
      order_id: body.order_id,
      user_email: body.user_email,
      discount_applied: body.discount_applied,
      order_amount: body.order_amount,
    })
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, usage: data }),
    {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function getCouponAnalytics(req: Request, supabase: any) {
  const url = new URL(req.url);
  const couponId = url.searchParams.get('coupon_id');

  if (couponId) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single();

    const { data: usageData, count } = await supabase
      .from('coupon_usage')
      .select('*', { count: 'exact' })
      .eq('coupon_id', couponId);

    const totalDiscount = usageData?.reduce((sum: number, usage: any) => sum + usage.discount_applied, 0) || 0;
    const totalRevenue = usageData?.reduce((sum: number, usage: any) => sum + usage.order_amount, 0) || 0;

    return new Response(
      JSON.stringify({
        success: true,
        analytics: {
          coupon,
          usage_count: count || 0,
          total_discount: totalDiscount,
          total_revenue: totalRevenue,
          average_order: usageData?.length ? totalRevenue / usageData.length : 0,
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  const { data: allCoupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  const analytics = [];

  for (const coupon of allCoupons || []) {
    const { data: usageData, count } = await supabase
      .from('coupon_usage')
      .select('*', { count: 'exact' })
      .eq('coupon_id', coupon.id);

    const totalDiscount = usageData?.reduce((sum: number, usage: any) => sum + usage.discount_applied, 0) || 0;

    analytics.push({
      code: coupon.code,
      description: coupon.description,
      usage_count: count || 0,
      total_discount: totalDiscount,
      is_active: coupon.is_active,
    });
  }

  return new Response(
    JSON.stringify({ success: true, analytics }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}
