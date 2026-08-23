import { CountryCode } from '../entity';
import { ICountryProvider } from './providers/base';

export class UnsupportedCountryException extends Error {
    constructor(country: string) {
        super(`Country ${country} is not supported by OptiTalent Localization Engine.`);
        this.name = 'UnsupportedCountryException';
    }
}

export class LocalizationEngine {
    private static providers = new Map<CountryCode, ICountryProvider>();

    static registerProvider(provider: ICountryProvider) {
        this.providers.set(provider.countryCode, provider);
    }

    static getProvider(country: CountryCode): ICountryProvider {
        const provider = this.providers.get(country);
        if (!provider) {
            throw new UnsupportedCountryException(country);
        }
        return provider;
    }
}
