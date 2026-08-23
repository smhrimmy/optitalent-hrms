export interface ExpenseItem {
    id: string;
    expenseReportId: string;
    amount: number;
    currency: string;
    category: string;
    date: Date;
    receiptUrl?: string;
    isPolicyViolated: boolean;
    policyViolationReason?: string;
}

export interface ExpenseReport {
    id: string;
    tenantId: string;
    employeeId: string;
    totalAmount: number;
    currency: string;
    items: ExpenseItem[];
    status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REIMBURSED';
    submittedAt?: Date;
}

// Mock DB
const expenseReportsDB = new Map<string, ExpenseReport>();

export class ExpenseEngine {
    
    /**
     * Submit an expense report for validation and approval
     */
    static async submitExpenseReport(tenantId: string, employeeId: string, items: Omit<ExpenseItem, 'id' | 'expenseReportId' | 'isPolicyViolated'>[]): Promise<ExpenseReport> {
        const reportId = `exp_${Date.now()}`;
        
        let totalAmount = 0;
        const processedItems: ExpenseItem[] = items.map((item, index) => {
            totalAmount += item.amount;
            
            // Mock Policy Check: e.g. Meals > 1000 is a violation
            const isPolicyViolated = item.category === 'MEALS' && item.amount > 1000;
            
            return {
                ...item,
                id: `item_${Date.now()}_${index}`,
                expenseReportId: reportId,
                isPolicyViolated,
                policyViolationReason: isPolicyViolated ? `Amount ₹${item.amount} exceeds daily limit of ₹1000 for MEALS.` : undefined
            };
        });

        const report: ExpenseReport = {
            id: reportId,
            tenantId,
            employeeId,
            totalAmount,
            currency: processedItems[0]?.currency || 'INR', // Default to INR
            items: processedItems,
            status: 'SUBMITTED',
            submittedAt: new Date(),
        };

        expenseReportsDB.set(reportId, report);
        
        // Trigger workflow
        // EventRegistry.publish('expense.submitted', report);

        return report;
    }

    /**
     * Process reimbursement
     */
    static async reimburseExpense(reportId: string): Promise<ExpenseReport> {
        const report = expenseReportsDB.get(reportId);
        if (!report) throw new Error('Expense report not found');
        
        if (report.status !== 'APPROVED') {
            throw new Error('Expense must be APPROVED before reimbursement');
        }

        report.status = 'REIMBURSED';
        
        // Publish event for Payroll integration
        // EventRegistry.publish('expense.reimbursed', report);
        
        return report;
    }
}
