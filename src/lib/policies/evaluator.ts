import { Policy, PolicyContext, PolicyEvaluationResult } from './types';
import { conditionEvaluator, ASTNode } from '../workflows/evaluator';

export class PolicyEvaluator {
  
  // Defines the precedence of scopes from least specific to most specific
  private scopePrecedence: Record<string, number> = {
    'GLOBAL': 0,
    'TENANT': 1,
    'LEGAL_ENTITY': 2,
    'COUNTRY': 3,
    'STATE': 4,
    'LOCATION': 5,
    'DEPARTMENT': 6,
    'JOB_FAMILY': 7,
    'EMPLOYMENT_TYPE': 8,
    'EMPLOYEE': 9
  };

  /**
   * Calculates the effective policy for a given resource and context
   * @param resource The resource domain (e.g., 'leave')
   * @param availablePolicies All active policies in the system for this company/resource
   * @param context The employee and evaluation context
   */
  evaluate(resource: string, availablePolicies: Policy[], context: PolicyContext): PolicyEvaluationResult {
    
    // 1. Filter policies that apply to this resource and are active on the given date
    const applicablePolicies = availablePolicies.filter(p => {
        if (p.resource !== resource || p.status !== 'ACTIVE') return false;
        
        const evalDate = new Date(context.date);
        const fromDate = new Date(p.effectiveFrom);
        if (evalDate < fromDate) return false;
        if (p.effectiveUntil) {
            const untilDate = new Date(p.effectiveUntil);
            if (evalDate > untilDate) return false;
        }
        
        return this.matchesScope(p, context.employee);
    });

    if (applicablePolicies.length === 0) {
        return {
            appliedPolicy: null,
            result: null,
            overriddenPolicies: [],
            reason: 'No applicable policies found for this context.'
        };
    }

    // 2. Sort by scope precedence (most specific first), then by explicitly defined priority
    applicablePolicies.sort((a, b) => {
        const scopeA = this.scopePrecedence[a.scope] || 0;
        const scopeB = this.scopePrecedence[b.scope] || 0;
        if (scopeA !== scopeB) return scopeB - scopeA; // Higher precedence first
        return b.priority - a.priority; // Higher numerical priority wins
    });

    // 3. The winner is the first one
    const appliedPolicy = applicablePolicies[0];
    const overriddenPolicies = applicablePolicies.slice(1);

    // 4. Evaluate rules inside the winning policy
    let finalResult = null;
    let ruleMatched = false;

    // Rules are evaluated top to bottom. First matching condition wins.
    for (const rule of appliedPolicy.rules) {
        if (!rule.conditionId) {
            finalResult = rule.result; // Default fallback rule
            ruleMatched = true;
            break;
        }

        // In a full implementation, we'd look up the AST reference from a database
        // For this mock, we assume rule.conditionId contains an AST object directly
        const ast = rule.conditionId as unknown as ASTNode; 
        if (conditionEvaluator.evaluate(ast, { employee: context.employee })) {
            finalResult = rule.result;
            ruleMatched = true;
            break;
        }
    }

    return {
        appliedPolicy,
        result: finalResult,
        overriddenPolicies,
        reason: `Applied policy '${appliedPolicy.name}' at scope ${appliedPolicy.scope}${appliedPolicy.scopeValue ? ' (' + appliedPolicy.scopeValue + ')' : ''}. ${overriddenPolicies.length} lower precedence policies were overridden.`
    };
  }

  private matchesScope(policy: Policy, employee: Record<string, any>): boolean {
      switch (policy.scope) {
          case 'GLOBAL':
          case 'TENANT':
              return true;
          case 'COUNTRY':
              return employee.country === policy.scopeValue;
          case 'DEPARTMENT':
              return employee.department === policy.scopeValue;
          case 'EMPLOYMENT_TYPE':
              return employee.employmentType === policy.scopeValue;
          case 'EMPLOYEE':
              return employee.id === policy.scopeValue;
          // Implement other scopes...
          default:
              return false;
      }
  }
}

export const policyEvaluator = new PolicyEvaluator();
