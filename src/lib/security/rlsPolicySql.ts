import { SupabaseRlsPolicy } from '../../types/securityCompliance';

export function renderRlsPolicySql(policy: SupabaseRlsPolicy): string {
  const withCheck = policy.withCheckExpression
    ? `\nWITH CHECK (\n  ${policy.withCheckExpression}\n);`
    : ';';

  return `-- ${policy.dataClassification} | audit=${policy.auditLoggingEnabled}
ALTER TABLE ${policy.tableName} ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${policy.tableName} FORCE ROW LEVEL SECURITY;

CREATE POLICY "${policy.policyName}"
ON public.${policy.tableName}
FOR ${policy.command}
TO ${policy.roles.join(', ')}
USING (
  ${policy.usingExpression}
)${withCheck}`;
}

export function renderForceRlsCatalog(policies: SupabaseRlsPolicy[]): string {
  const uniqueTables = [...new Set(policies.map((p) => p.tableName))];
  return uniqueTables
    .map((table) => `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;\nALTER TABLE public.${table} FORCE ROW LEVEL SECURITY;`)
    .join('\n');
}
