import { supabase } from '../supabase';

// Edge Function fallback (when credentials are stored in Supabase secrets instead of .env.local)
const FUNCTION_NAME = 'cloudinary-sign';
const FOLDER = 'employees';
const PUBLIC_ID_PATTERN = new RegExp(`^${FOLDER}/[A-Za-z0-9_-]+$`);

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const getEnvConfig = () => ({
  cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim(),
  apiKey: (import.meta.env.VITE_CLOUDINARY_API_KEY || '').trim(),
  apiSecret: (import.meta.env.VITE_CLOUDINARY_API_SECRET || '').trim(),
  uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim(),
});

async function sha1Hex(input) {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Cloudinary signature: sorted "key=value" pairs joined by "&", followed by the API secret
function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return sha1Hex(toSign + apiSecret);
}

async function callFunction(body) {
  const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, { body });
  if (error) {
    let message = error.message;
    try {
      const details = await error.context?.json();
      if (details?.error) message = details.error;
    } catch {
      // keep generic message
    }
    throw new Error(message);
  }
  return data;
}

// Upload a photo to Cloudinary (uses .env.local config if present, otherwise the Edge Function)
export async function uploadEmployeePhoto(file) {
  const { cloudName, apiKey, apiSecret, uploadPreset } = getEnvConfig();
  const form = new FormData();
  form.append('file', file);

  let targetCloud = cloudName;

  if (cloudName && apiKey && apiSecret) {
    // 1. Direct signed upload using .env.local credentials
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${FOLDER}/${crypto.randomUUID()}`;
    const params = { public_id: publicId, timestamp };
    if (uploadPreset) params.upload_preset = uploadPreset;

    const signature = await signParams(params, apiSecret);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('public_id', publicId);
    if (uploadPreset) form.append('upload_preset', uploadPreset);
    form.append('signature', signature);
  } else if (cloudName && uploadPreset) {
    // 2. Direct unsigned upload using an upload preset from .env.local
    form.append('upload_preset', uploadPreset);
    form.append('folder', FOLDER);
  } else {
    // 3. Server-signed upload via Supabase Edge Function
    const signed = await callFunction({ action: 'sign-upload' });
    targetCloud = signed.cloudName;
    form.append('api_key', signed.apiKey);
    form.append('timestamp', String(signed.timestamp));
    form.append('signature', signed.signature);
    Object.entries(signed.params).forEach(([key, value]) => form.append(key, value));
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${targetCloud}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(result?.error?.message || 'Photo upload failed.');
  }
  return { url: result.secure_url, publicId: result.public_id };
}

// Delete a photo from Cloudinary. Never throws: a leftover image should not block saving.
export async function deleteEmployeePhoto(publicId) {
  if (!publicId || !PUBLIC_ID_PATTERN.test(publicId)) return;
  const { cloudName, apiKey, apiSecret } = getEnvConfig();

  try {
    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.floor(Date.now() / 1000);
      const params = { invalidate: 'true', public_id: publicId, timestamp };
      const signature = await signParams(params, apiSecret);

      const form = new FormData();
      form.append('public_id', publicId);
      form.append('invalidate', 'true');
      form.append('timestamp', String(timestamp));
      form.append('api_key', apiKey);
      form.append('signature', signature);

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: form,
      });
    } else if (!cloudName) {
      await callFunction({ action: 'delete', publicId });
    }
  } catch (err) {
    console.warn(`Could not delete Cloudinary image "${publicId}":`, err);
  }
}

// Smaller, auto-format (WebP/AVIF), face-centred version of a Cloudinary image.
// Non-Cloudinary URLs are returned unchanged.
export function optimizedUrl(url, width = 600, height = 460) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url;
  return url.replace(
    '/image/upload/',
    `/image/upload/f_auto,q_auto,c_fill,g_face,w_${width},h_${height}/`
  );
}
