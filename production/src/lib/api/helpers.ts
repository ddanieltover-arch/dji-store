import { NextRequest, NextResponse } from 'next/server';
import type { EmailLocale } from '../email/events';
import { resolveLocale } from '../email/i18n';

export function parseBody<T extends Record<string, unknown>>(req: NextRequest): Promise<T> {
  return req.json() as Promise<T>;
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function requireFields(body: Record<string, unknown>, fields: string[]): string | null {
  for (const field of fields) {
    if (!body[field] || String(body[field]).trim() === '') {
      return field;
    }
  }
  return null;
}

export function getLocale(body: Record<string, unknown>, req: NextRequest): EmailLocale {
  const header = req.headers.get('x-locale');
  const raw = String(body.locale ?? header ?? 'en');
  return resolveLocale(raw);
}

export function emailFromBody(body: Record<string, unknown>): string {
  return String(body.customerEmail ?? body.email ?? '');
}
