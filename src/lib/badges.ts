/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BADGE_MAP: Record<string, { name: string; url: string; city?: string }> = {
  // Rabat
  '550e8400-e29b-41d4-a716-446655441111': { name: 'Abzim', url: 'Abzim.png', city: 'Rabat' },
  '550e8400-e29b-41d4-a716-446655442222': { name: 'Aghraf', url: 'Aghraf.png', city: 'Rabat' },
  '550e8400-e29b-41d4-a716-446655443333': { name: 'Chebbka', url: 'Chebbka.png', city: 'Rabat' },
  '550e8400-e29b-41d4-a716-446655444444': { name: 'Fnous', url: 'Fnous.png', city: 'Rabat' },
  '550e8400-e29b-41d4-a716-446655445555': { name: 'Ibzimen', url: 'Ibzimen.png', city: 'Rabat' },
  // Chefchaouen
  '98b50e2d-dc99-43ef-b387-052637738c01': { name: 'Khalkhal Mawj', url: 'Khalkhal Mawj.png', city: 'Chefchaouen' },
  '98b50e2d-dc99-43ef-b387-052637738c02': { name: 'khalkhal', url: 'khalkhal.png', city: 'Chefchaouen' },
  '98b50e2d-dc99-43ef-b387-052637738c03': { name: 'khit-Roh', url: 'khit-Roh.png', city: 'Chefchaouen' },
  '98b50e2d-dc99-43ef-b387-052637738c04': { name: 'Khmissa', url: 'Khmissa.png', city: 'Chefchaouen' },
  '98b50e2d-dc99-43ef-b387-052637738c05': { name: 'Mdama bahar', url: 'Mdama bahar.png', city: 'Chefchaouen' },
  // Fès
  '550e8400-e29b-41d4-a716-44665544f111': { name: 'Mdama', url: 'Mdama.png', city: 'Fès' },
  '550e8400-e29b-41d4-a716-44665544f222': { name: 'Mharma', url: 'Mharma.png', city: 'Fès' },
  '550e8400-e29b-41d4-a716-44665544f333': { name: 'Mniqqa', url: 'Mniqqa.png', city: 'Fès' },
  '550e8400-e29b-41d4-a716-44665544f444': { name: 'Qabt', url: 'Qabt.png', city: 'Fès' },
  '550e8400-e29b-41d4-a716-44665544f555': { name: 'Sertia Atlantik', url: 'Sertia Atlantik.png', city: 'Fès' },
  // Marrakech
  '98b50e2d-dc99-43ef-b387-052637738a01': { name: 'Sertla', url: 'Sertla.png', city: 'Marrakech' },
  '98b50e2d-dc99-43ef-b387-052637738a02': { name: 'Tabraat', url: 'Tabraat.png', city: 'Marrakech' },
  '98b50e2d-dc99-43ef-b387-052637738a03': { name: 'Tasfift', url: 'Tasfift.png', city: 'Marrakech' },
  '98b50e2d-dc99-43ef-b387-052637738a04': { name: 'Tazrabt Sahara', url: 'Tazrabt Sahara.png', city: 'Marrakech' },
  '98b50e2d-dc99-43ef-b387-052637738a05': { name: 'Tazrabt', url: 'Tazrabt.png', city: 'Marrakech' },
  // Dakhla
  'f83e1989-e001-470a-bda4-722124c346f1': { name: 'Tifinagh', url: 'Tifinagh.png', city: 'Dakhla' },
  '0f576c5b-6cba-4efc-a85d-ddc0aa307dc3': { name: 'Tizerzai', url: 'Tizerzai.png', city: 'Dakhla' }
};

export const getBadgeUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Use decodeURIComponent first to ensure we don't double encode
  const cleanPath = decodeURIComponent(url);
  return `https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/${encodeURIComponent(cleanPath)}`;
};
