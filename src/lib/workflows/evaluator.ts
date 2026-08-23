// Safe AST-based condition evaluator

export interface ASTNode {
  operator: 'AND' | 'OR' | 'NOT' | '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'exists';
  left?: ASTNode | string | number | boolean;
  right?: ASTNode | string | number | boolean;
  field?: string; // used for leaf nodes extracting context
}

export class ConditionEvaluator {
  
  /**
   * Evaluates an AST condition safely against a given context.
   */
  evaluate(ast: ASTNode, context: Record<string, any>): boolean {
    if (!ast) return true; // Empty condition is implicitly true

    switch (ast.operator) {
      case 'AND':
        return this.evaluate(ast.left as ASTNode, context) && this.evaluate(ast.right as ASTNode, context);
      case 'OR':
        return this.evaluate(ast.left as ASTNode, context) || this.evaluate(ast.right as ASTNode, context);
      case 'NOT':
        return !this.evaluate(ast.left as ASTNode, context);
      case '=':
        return this.resolveValue(ast.left, context) === this.resolveValue(ast.right, context);
      case '!=':
        return this.resolveValue(ast.left, context) !== this.resolveValue(ast.right, context);
      case '>':
        return this.resolveValue(ast.left, context) > this.resolveValue(ast.right, context);
      case '<':
        return this.resolveValue(ast.left, context) < this.resolveValue(ast.right, context);
      case '>=':
        return this.resolveValue(ast.left, context) >= this.resolveValue(ast.right, context);
      case '<=':
        return this.resolveValue(ast.left, context) <= this.resolveValue(ast.right, context);
      case 'contains':
        const target = this.resolveValue(ast.left, context);
        const search = this.resolveValue(ast.right, context);
        if (typeof target === 'string' && typeof search === 'string') {
          return target.includes(search);
        }
        if (Array.isArray(target)) {
          return target.includes(search);
        }
        return false;
      case 'exists':
        return this.resolveValue(ast.left, context) !== undefined;
      default:
        throw new Error(`Unsupported operator: ${ast.operator}`);
    }
  }

  /**
   * Resolves a value safely. If it's a leaf node object pointing to a field, extracts it from context.
   */
  private resolveValue(val: any, context: Record<string, any>): any {
    if (val && typeof val === 'object' && val.field) {
      // Support dot notation like 'leave.duration'
      return val.field.split('.').reduce((acc: any, part: string) => acc && acc[part], context);
    }
    return val;
  }
}

export const conditionEvaluator = new ConditionEvaluator();
