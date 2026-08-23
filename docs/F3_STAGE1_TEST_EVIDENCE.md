### Test F3-2.1: Cross-company direct Server Action invocation
- **Result**: PASS
- **Evidence**: Blocked with error: Unauthorized

### Test F3-3.1: Employee hitting list API endpoint directly
- **Result**: PASS
- **Evidence**: HTTP 401

### Test F3-4.1: Company B querying Company A ID via body
- **Result**: PASS
- **Evidence**: Rejected: 403

### Test F3-5.1: Employee viewing Admin profile salary
- **Result**: PASS
- **Evidence**: Salary redacted

### Test F3-6.1: Company A injecting row into Company B via RLS
- **Result**: PASS
- **Evidence**: RLS blocked insert: Could not find the 'email' column of 'employees' in the schema cache

### Test F3-7.1: Employee attempting HR/Admin mutation (create)
- **Result**: PASS
- **Evidence**: Blocked: 403
