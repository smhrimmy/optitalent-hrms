import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { CompanyContext } from '../auth-server';

export interface BaseRepositoryOptions {
  context: CompanyContext;
  client?: SupabaseClient; // Allow injecting transaction client if needed
}

/**
 * Canonical Base Repository for OptiTalent
 * Enforces company boundaries for all database interactions.
 */
export class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Helper to ensure all queries are automatically scoped to the user's active company.
   * This is the SECOND line of defense (RLS is the final line).
   */
  protected getQuery(options: BaseRepositoryOptions) {
    const client = options.client || supabase;
    return client.from(this.tableName).select('*').eq('company_id', options.context.companyId);
  }

  protected getUpdateQuery(options: BaseRepositoryOptions) {
    const client = options.client || supabase;
    return client.from(this.tableName).update({}).eq('company_id', options.context.companyId);
  }

  protected getDeleteQuery(options: BaseRepositoryOptions) {
    const client = options.client || supabase;
    return client.from(this.tableName).delete().eq('company_id', options.context.companyId);
  }

  // Example base methods that enforce boundaries
  
  async findById(id: string, options: BaseRepositoryOptions) {
    const { data, error } = await this.getQuery(options).eq('id', id).single();
    if (error) throw error;
    return data as T;
  }

  async list(options: BaseRepositoryOptions) {
    const { data, error } = await this.getQuery(options);
    if (error) throw error;
    return data as T[];
  }
}
