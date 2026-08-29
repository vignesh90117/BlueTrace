import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db/serverDb';
import { RetirementCertificate } from '@/types';

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    certificates: db.certificates,
    count: db.certificates.length
  });
}

export async function POST(request: Request) {
  try {
    const { holdingId, amount, retireeName, beneficiary, reason } = await request.json();
    const db = getDatabase();

    const holding = db.holdings.find(h => h.id === holdingId);
    if (!holding) {
      return NextResponse.json({ success: false, error: 'Credit holding not found' }, { status: 404 });
    }

    if (amount <= 0 || amount > holding.availableCredits) {
      return NextResponse.json({ success: false, error: 'Invalid retirement amount' }, { status: 400 });
    }

    const certId = `CERT-2026-00${db.certificates.length + 1}`;
    const burnTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const certHash = 'sha256-' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    holding.availableCredits -= amount;
    holding.retiredCredits += amount;

    const project = db.projects.find(p => p.id === holding.projectId);
    if (project) {
      project.totalCreditsRetired += amount;
    }

    const newCertificate: RetirementCertificate = {
      certificateId: certId,
      holdingId,
      projectId: holding.projectId,
      projectName: holding.projectName,
      batchId: holding.batchId,
      vintage: 2026,
      serialRange: `${holding.serialRange.split('-').slice(0, 4).join('-')}-R0001-${amount}`,
      amountTCO2e: amount,
      retireeName,
      beneficiary,
      reason,
      retiredAt: new Date().toISOString(),
      retiredTimestamp: new Date().toISOString(),
      burnerWallet: holding.holderWallet,
      burnTxHash,
      onChainTxHash: burnTxHash,
      immutableCertificateHash: certHash,
    };

    db.certificates.unshift(newCertificate);

    db.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash: burnTxHash,
      blockNumber: 4893140 + db.transactions.length,
      timestamp: new Date().toISOString(),
      from: holding.holderWallet,
      to: '0x000000000000000000000000000000000000dEaD',
      type: 'CREDITS_RETIRED',
      details: `Permanently burned ${amount.toLocaleString()} BCT credits. Issued tamper-proof offset Certificate ${certId} to ${beneficiary}.`
    });

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      certificate: newCertificate,
      burnTxHash
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
