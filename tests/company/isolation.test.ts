import { describe, it, expect, beforeEach } from 'vitest';
import { companyRepository } from '../../src/lib/company/repository';
import { CompanyDNA } from '../../src/lib/company/types';

describe('Company Configuration Isolation', () => {

    beforeEach(async () => {
        // Setup two distinct tenant configurations
        const tenantA: CompanyDNA = {
            tenantId: 'tenant-a-mfg',
            name: 'OptiManufacturing',
            legalName: 'OptiMfg LLC',
            industry: 'Manufacturing',
            size: '501-2000',
            geography: { countries: ['US'], regions: [], states: [], legalEntities: [], locations: [] },
            workforceTypes: ['Full-time', 'Contractor'],
            workModels: ['Factory'],
            operatingModel: 'Plant-based',
            payroll: { countries: ['US'], payFrequency: 'Bi-weekly', currency: 'USD' },
            enabledModules: ['core_hr', 'shift_management'],
            enabledFeatures: [],
            version: 1,
            lastUpdated: new Date().toISOString()
        };

        const tenantB: CompanyDNA = {
            tenantId: 'tenant-b-tech',
            name: 'OptiTech',
            legalName: 'OptiTech Inc',
            industry: 'Technology',
            size: '101-500',
            geography: { countries: ['UK'], regions: [], states: [], legalEntities: [], locations: [] },
            workforceTypes: ['Full-time'],
            workModels: ['Remote'],
            operatingModel: 'Project-based',
            payroll: { countries: ['UK'], payFrequency: 'Monthly', currency: 'GBP' },
            enabledModules: ['core_hr', 'projects'],
            enabledFeatures: [],
            version: 1,
            lastUpdated: new Date().toISOString()
        };

        await companyRepository.saveConfiguration(tenantA);
        await companyRepository.saveConfiguration(tenantB);
    });

    it('ensures Tenant A cannot access or leak into Tenant B configuration', async () => {
        const configA = await companyRepository.getConfiguration('tenant-a-mfg');
        const configB = await companyRepository.getConfiguration('tenant-b-tech');

        expect(configA?.industry).toBe('Manufacturing');
        expect(configB?.industry).toBe('Technology');
        
        // Ensure modifying A doesn't modify B
        if (configA) {
            configA.name = 'Hacked Mfg';
            await companyRepository.saveConfiguration(configA);
        }

        const reloadedB = await companyRepository.getConfiguration('tenant-b-tech');
        expect(reloadedB?.name).toBe('OptiTech'); // Unaffected
    });

    it('auto-increments configuration version on save', async () => {
        const configA = await companyRepository.getConfiguration('tenant-a-mfg');
        expect(configA?.version).toBe(1);

        if (configA) {
            await companyRepository.saveConfiguration(configA);
        }

        const updatedA = await companyRepository.getConfiguration('tenant-a-mfg');
        expect(updatedA?.version).toBe(2);
    });
});
