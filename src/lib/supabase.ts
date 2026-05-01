/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

type NoopQueryResult<T = any> = Promise<{ data: T[] | null; error: null }>;

function createNoopQueryBuilder() {
  const builder: any = {
    select() {
      return builder;
    },
    eq() {
      return builder;
    },
    order() {
      return Promise.resolve({ data: [], error: null });
    },
  };

  return builder;
}

function createFallbackSupabaseClient(): SupabaseClient {
  return {
    from() {
      return createNoopQueryBuilder();
    },
  } as unknown as SupabaseClient;
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackSupabaseClient();
