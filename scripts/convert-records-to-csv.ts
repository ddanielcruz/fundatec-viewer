import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { Record } from './extract-results';

async function main() {
  try {
    // Read the JSON file
    const inputPath = join(process.cwd(), 'data', 'records.json');
    const records: Record[] = JSON.parse(await readFile(inputPath, 'utf-8'));

    // Create CSV header
    const headers = [
      'Especialidade',
      'Nome',
      'Nota TO',
      'Programa de Governo',
      'Nota Final',
      'Classificação',
    ];

    // Convert records to CSV rows
    const rows = records.map((record) => [
      record.specialty,
      record.name,
      record.notaTO.toString().replace('.', ','), // Convert back to Brazilian number format
      record.programaGoverno ? 'Sim' : 'Não',
      record.notaFinal.toString().replace('.', ','), // Convert back to Brazilian number format
      record.ranking.toString(),
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

    // Write to CSV file
    const outputPath = join(process.cwd(), 'data', 'records.csv');
    await writeFile(outputPath, csvContent, 'utf-8');

    console.log(`Successfully converted ${records.length} records to CSV`);
    console.log(`CSV file saved to: ${outputPath}`);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

main();
