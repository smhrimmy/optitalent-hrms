import { NextResponse } from 'next/server';

// Global variable to act as a lock for the synthetic ledger
// In a real environment, this is handled by postgres row locks (FOR UPDATE)
declare global {
    var _payrollLocks: Set<string>;
    var _payrollLedger: Record<string, boolean>;
}

if (!global._payrollLocks) {
    global._payrollLocks = new Set();
}
if (!global._payrollLedger) {
    global._payrollLedger = {};
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { employeeId, amount, ref } = body;

        if (!employeeId || !amount || !ref) {
            return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
        }

        const lockKey = `${employeeId}-${ref}`;

        // 1. Transaction Lock check (Simulates FOR UPDATE)
        if (global._payrollLocks.has(lockKey)) {
            return NextResponse.json({ success: false, error: 'Transaction locked/concurrent modification detected' }, { status: 409 });
        }

        // 2. Ledger duplicate check (Simulates UNIQUE constraint)
        if (global._payrollLedger[lockKey]) {
            return NextResponse.json({ success: false, error: 'Duplicate transaction reference' }, { status: 409 });
        }

        // Acquire lock
        global._payrollLocks.add(lockKey);

        // Simulate database latency
        await new Promise(r => setTimeout(r, 100));

        // Commit to ledger
        global._payrollLedger[lockKey] = true;
        
        // Release lock
        global._payrollLocks.delete(lockKey);

        return NextResponse.json({ success: true, ref });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
