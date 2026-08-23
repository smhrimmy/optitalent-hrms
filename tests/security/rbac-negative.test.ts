import { PermissionService } from '../../src/lib/permissions';
import { buildAuthRequest } from '../../src/lib/auth-server';
import { SupabaseEmployeeRepository } from '../../src/lib/repository/employee-repository';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authServer from '../../src/lib/auth-server';

// Mock the getServerContext to inject test identities
vi.mock('../../src/lib/auth-server', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getServerContext: vi.fn(),
  };
});

describe('RBAC & ABAC Negative Security Tests', () => {
    
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Tenant Isolation', () => {
    it('should deny cross-tenant access in repository', async () => {
      // User belongs to Tenant-A
      vi.mocked(authServer.getServerContext).mockResolvedValue({
        tenantId: 'tenant-A',
        userId: 'user-1',
        role: 'employee',
        user: { id: 'user-1' }
      });

      const repo = new SupabaseEmployeeRepository();
      
      // Attempting to fetch a user from Tenant-B (simulating a direct IDOR)
      // Note: In real life Supabase RLS handles this, but the repo also enforces ABAC.
      
      // Let's test the PermissionService directly for tenant boundaries
      const authReq = buildAuthRequest(
        { tenantId: 'tenant-A', userId: 'user-1', role: 'employee' },
        'employee',
        'view',
        'target-user-1',
        { tenant_id: 'tenant-B' } // Target record belongs to Tenant-B
      );

      expect(() => PermissionService.enforce(authReq)).toThrow('Forbidden');
    });
  });

  describe('Direct API / Action Access Without Token', () => {
    it('should deny access when context is missing', async () => {
      vi.mocked(authServer.getServerContext).mockResolvedValue(null);

      const repo = new SupabaseEmployeeRepository();
      await expect(repo.getEmployees()).rejects.toThrow('Unauthorized');
    });
  });

  describe('Field-Level Redaction', () => {
    it('should redact sensitive fields for non-privileged users', () => {
        const authReq = buildAuthRequest(
            { tenantId: 'tenant-A', userId: 'user-1', role: 'employee' }, // Employee
            'employee',
            'view',
            'target-user-2', // Viewing someone else
            { tenant_id: 'tenant-A', id: 'target-user-2' } 
          );
    
          const result = PermissionService.enforce(authReq);
          
          // An employee viewing another employee should not see salary
          expect(result.permittedFields).toBeDefined();
          expect(result.permittedFields).not.toContain('salary');
          expect(result.permittedFields).not.toContain('bank_account');
    });

    it('should allow viewing own sensitive fields', () => {
        const authReq = buildAuthRequest(
            { tenantId: 'tenant-A', userId: 'user-1', role: 'employee' }, 
            'employee',
            'view',
            'user-1', // Viewing self
            { tenant_id: 'tenant-A', id: 'user-1' } 
          );
    
          const result = PermissionService.enforce(authReq);
          
          // Should have access to all fields (undefined means no restriction)
          // or explicitly includes salary if using a whitelist.
          if (result.permittedFields) {
            expect(result.permittedFields).toContain('salary');
          }
    });
  });

  describe('AI Workflow Authorization', () => {
    it('should deny AI workflow execution for unauthorized roles', () => {
        const authReq = buildAuthRequest(
            { tenantId: 'tenant-A', userId: 'guest-1', role: 'guest' },
            'ai',
            'run'
        );

        expect(() => PermissionService.enforce(authReq)).toThrow('Forbidden');
    });
  });
});
