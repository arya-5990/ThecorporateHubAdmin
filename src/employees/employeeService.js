import { supabase } from '../supabase';
import { uploadEmployeePhoto, deleteEmployeePhoto } from './cloudinary';

const TABLE = 'employees';

export const isBackendConfigured = () => Boolean(import.meta.env.VITE_SUPABASE_URL);

// DB row (snake_case) -> UI object
const fromRow = (row) => ({
  id: row.id,
  name: row.name,
  designation: row.designation,
  experience: row.experience || '',
  description: row.description || '',
  responsibilities: row.responsibilities || [],
  image: row.image_url || '',
  imagePublicId: row.image_public_id || null,
  sortOrder: row.sort_order ?? 0,
  isActive: row.is_active ?? true,
});

// UI form data -> DB columns
const toRow = (data) => ({
  name: data.name,
  designation: data.designation,
  experience: data.experience,
  description: data.description,
  responsibilities: data.responsibilities,
  image_url: data.image || '',
});

// RLS turns unauthorised writes into "0 rows" instead of an error, so check for it
const ensureRow = (rows) => {
  if (!rows || rows.length === 0) {
    throw new Error('Change was not saved. You may not have admin permission, or the employee no longer exists.');
  }
  return rows[0];
};

export async function fetchEmployees() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function createEmployee(data, imageFile, sortOrder) {
  const photo = imageFile ? await uploadEmployeePhoto(imageFile) : null;

  const row = { ...toRow(data), sort_order: sortOrder, image_public_id: null };
  if (photo) {
    row.image_url = photo.url;
    row.image_public_id = photo.publicId;
  }

  const { data: rows, error } = await supabase.from(TABLE).insert(row).select('*');
  if (error || !rows?.length) {
    if (photo) await deleteEmployeePhoto(photo.publicId); // don't leave an orphan image
    throw error || new Error('Employee was not saved. You may not have admin permission.');
  }
  return fromRow(rows[0]);
}

export async function updateEmployee(previous, data, imageFile) {
  const photo = imageFile ? await uploadEmployeePhoto(imageFile) : null;

  const row = toRow(data);
  if (photo) {
    row.image_url = photo.url;
    row.image_public_id = photo.publicId;
  } else if (row.image_url === previous.image) {
    row.image_public_id = previous.imagePublicId; // photo unchanged
  } else {
    row.image_public_id = null; // removed, or replaced with a pasted URL
  }

  const { data: rows, error } = await supabase
    .from(TABLE)
    .update(row)
    .eq('id', previous.id)
    .select('*');

  let updated;
  try {
    if (error) throw error;
    updated = ensureRow(rows);
  } catch (err) {
    if (photo) await deleteEmployeePhoto(photo.publicId);
    throw err;
  }

  // Only remove the old photo once the row points somewhere else
  if (previous.imagePublicId && previous.imagePublicId !== updated.image_public_id) {
    await deleteEmployeePhoto(previous.imagePublicId);
  }
  return fromRow(updated);
}

export async function deleteEmployee(employee) {
  const { data: rows, error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', employee.id)
    .select('id');
  if (error) throw error;
  ensureRow(rows);

  await deleteEmployeePhoto(employee.imagePublicId);
}

export async function setEmployeeActive(id, isActive) {
  const { data: rows, error } = await supabase
    .from(TABLE)
    .update({ is_active: isActive })
    .eq('id', id)
    .select('*');
  if (error) throw error;
  return fromRow(ensureRow(rows));
}

// items: [{ id, sortOrder }] - only the employees whose position changed
export async function updateSortOrders(items) {
  const results = await Promise.all(
    items.map(({ id, sortOrder }) =>
      supabase.from(TABLE).update({ sort_order: sortOrder }).eq('id', id).select('id')
    )
  );
  for (const { data, error } of results) {
    if (error) throw error;
    ensureRow(data);
  }
}

