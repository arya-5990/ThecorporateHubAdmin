// Supabase Edge Function: cloudinary-sign
//
// Keeps the Cloudinary API secret on the server. The admin panel calls this
// function (with the logged-in admin's JWT) to:
//   - { action: 'sign-upload' }           -> get a signature for a direct browser upload
//   - { action: 'delete', publicId: ... } -> delete an employee photo from Cloudinary
//
// Required secrets (supabase secrets set ...):
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// SUPABASE_URL and SUPABASE_ANON_KEY are provided automatically by Supabase.

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME') ?? '';
const API_KEY = Deno.env.get('CLOUDINARY_API_KEY') ?? '';
const API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET') ?? '';

// Every employee photo lives under this prefix; deletes outside it are refused.
const FOLDER = 'employees';
const PUBLIC_ID_PATTERN = new RegExp(`^${FOLDER}/[A-Za-z0-9_-]+$`);

// Upload rules enforced by the signature (the browser cannot change them)
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp';
const INCOMING_TRANSFORMATION = 'c_limit,w_1200,h_1200';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sha1Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Cloudinary signature: sorted "key=value" pairs joined by "&", followed by the API secret
function signParams(params: Record<string, string | number>): Promise<string> {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return sha1Hex(toSign + API_SECRET);
}

async function requireAdmin(req: Request): Promise<Response | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Missing authorization header.' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return json({ error: 'Not authenticated.' }, 401);
  if (data.user.app_metadata?.role !== 'admin') {
    return json({ error: 'Only administrators can manage employee photos.' }, 403);
  }
  return null;
}

async function handleSignUpload(): Promise<Response> {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    public_id: `${FOLDER}/${crypto.randomUUID()}`,
    allowed_formats: ALLOWED_FORMATS,
    transformation: INCOMING_TRANSFORMATION,
    timestamp,
  };
  const signature = await signParams(params);

  // The browser must send exactly these params (plus file, api_key, signature)
  const { timestamp: _ts, ...uploadParams } = params;
  return json({
    cloudName: CLOUD_NAME,
    apiKey: API_KEY,
    timestamp,
    signature,
    params: uploadParams,
  });
}

async function handleDelete(publicId: unknown): Promise<Response> {
  if (typeof publicId !== 'string' || !PUBLIC_ID_PATTERN.test(publicId)) {
    return json({ error: `Only images inside "${FOLDER}/" can be deleted.` }, 400);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, invalidate: 'true', timestamp };
  const signature = await signParams(params);

  const form = new FormData();
  form.append('public_id', publicId);
  form.append('invalidate', 'true');
  form.append('timestamp', String(timestamp));
  form.append('api_key', API_KEY);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: form,
  });
  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    return json({ error: result?.error?.message ?? 'Cloudinary delete failed.' }, 502);
  }
  // result.result is "ok" or "not found" - both mean the image is gone
  return json({ result: result.result });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return json({ error: 'Cloudinary secrets are not configured on the server.' }, 500);
  }

  const authError = await requireAdmin(req);
  if (authError) return authError;

  let body: { action?: string; publicId?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  switch (body.action) {
    case 'sign-upload':
      return handleSignUpload();
    case 'delete':
      return handleDelete(body.publicId);
    default:
      return json({ error: 'Unknown action.' }, 400);
  }
});

