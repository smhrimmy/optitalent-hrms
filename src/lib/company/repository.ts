import { CompanyDNA } from './types';

class CompanyRepository {
    // Mock database for company configuration
    private configurations: Map<string, CompanyDNA> = new Map();

    async getConfiguration(companyId: string): Promise<CompanyDNA | null> {
        return this.configurations.get(companyId) || null;
    }

    async saveConfiguration(config: CompanyDNA): Promise<void> {
        // Automatically increment version
        const existing = await this.getConfiguration(config.companyId);
        config.version = existing ? existing.version + 1 : 1;
        config.lastUpdated = new Date().toISOString();
        
        this.configurations.set(config.companyId, config);
    }
}

export const companyRepository = new CompanyRepository();
