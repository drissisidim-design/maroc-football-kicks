import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SHOPIFY_STORE = 'football-store-morocco-j8f33.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';

interface OrderItem {
  variantId: string;
  quantity: number;
}

interface OrderRequest {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  city: string;
  items: OrderItem[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
    if (!SHOPIFY_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: 'Missing Shopify token' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: OrderRequest = await req.json();
    const { firstName, lastName, phone, address1, city, items } = body;

    if (!firstName || !lastName || !phone || !address1 || !city || !items?.length) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create order via Shopify Admin API
    const orderPayload = {
      order: {
        line_items: items.map((item) => ({
          variant_id: extractNumericId(item.variantId),
          quantity: item.quantity,
        })),
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address1,
          city: city,
          country: 'Morocco',
          country_code: 'MA',
          zip: '00000',
          phone: phone,
        },
        billing_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address1,
          city: city,
          country: 'Morocco',
          country_code: 'MA',
          zip: '00000',
          phone: phone,
        },
        note: `Commande via godasses.ma — Tel: ${phone}`,
        tags: 'godasses-website,COD',
        email: `${phone.replace(/[\s+()-]/g, '')}@godasses.ma`,
        financial_status: 'pending',
        send_receipt: false,
        send_fulfillment_receipt: false,
      },
    };

    const shopifyRes = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const shopifyData = await shopifyRes.json();

    if (!shopifyRes.ok) {
      console.error('Shopify error:', JSON.stringify(shopifyData));
      return new Response(JSON.stringify({ error: 'Shopify order creation failed', details: shopifyData }), {
        status: shopifyRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = shopifyData.order;

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      orderName: order.name,
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractNumericId(gid: string): number {
  const match = gid.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}
