import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    numProvinces: 63,
    numWards: 10600,
    currentWards: 10500
  });
}