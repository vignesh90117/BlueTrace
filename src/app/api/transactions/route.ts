import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db/serverDb';

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    transactions: db.transactions,
    count: db.transactions.length
  });
}
