import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db/serverDb';
import { Project } from '@/types';

export async function GET() {
  const db = getDatabase();
  return NextResponse.json({
    success: true,
    projects: db.projects,
    count: db.projects.length,
    lastUpdated: db.lastUpdated
  });
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json();
    const db = getDatabase();

    const nextIdx = db.projects.length + 1;
    const id = `BCR-IND-00${nextIdx}`;
    const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    const newProject: Project = {
      ...projectData,
      id,
      status: 'submitted',
      registeredDate: new Date().toISOString().split('T')[0],
      evidenceFiles: projectData.evidenceFiles || [],
      totalCreditsIssued: 0,
      totalCreditsRetired: 0,
      blockchainTx: {
        registryTxHash: txHash
      }
    };

    db.projects.unshift(newProject);
    db.transactions.unshift({
      id: `tx-${Date.now()}`,
      txHash,
      blockNumber: 4893120 + db.projects.length,
      timestamp: new Date().toISOString(),
      from: projectData.developerWallet || '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
      to: '0xRegistryContract119a0A678d10',
      type: 'PROJECT_REGISTRATION',
      details: `Project ${id} (${projectData.name}, ${projectData.areaHectares}ha) registered and persisted in database.`
    });

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      project: newProject,
      txHash
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
