export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'SGD' | 'AED' | 'AUD' | 'CAD';

export interface Money {
    amount: number;
    currency: CurrencyCode;
}

export class CurrencyConverter {
    // MOCK FX Table for Phase 3M. 
    // In production, this would be an effective-dated database table or live API.
    private static fxRatesToUSD: Record<CurrencyCode, number> = {
        'USD': 1.0,
        'INR': 0.012,
        'EUR': 1.09,
        'GBP': 1.27,
        'SGD': 0.74,
        'AED': 0.27,
        'AUD': 0.65,
        'CAD': 0.73,
    };

    /**
     * Converts Money from one currency to another using the FX table.
     */
    static convert(money: Money, targetCurrency: CurrencyCode): Money {
        if (money.currency === targetCurrency) return money;

        const amountInUSD = money.amount * this.fxRatesToUSD[money.currency];
        const finalAmount = amountInUSD / this.fxRatesToUSD[targetCurrency];

        return {
            amount: Number(finalAmount.toFixed(2)),
            currency: targetCurrency
        };
    }

    /**
     * Safely sums an array of mixed-currency Money objects into a target base currency.
     */
    static sum(monies: Money[], baseCurrency: CurrencyCode): Money {
        let total = 0;
        for (const m of monies) {
            total += this.convert(m, baseCurrency).amount;
        }
        return { amount: total, currency: baseCurrency };
    }
}
