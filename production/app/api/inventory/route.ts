import { NextRequest, NextResponse } from 'next/server';
import { fetchVariantAvailability } from '@/lib/inventory/repository';

export async function GET(req: NextRequest) {
  const variantId = req.nextUrl.searchParams.get('variantId');
  if (!variantId) {
    return NextResponse.json({ error: 'variantId required' }, { status: 400 });
  }
  const result = await fetchVariantAvailability(variantId);
  return NextResponse.json(result);
}
