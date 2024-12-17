import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import puppeteer, { Page } from 'puppeteer';

interface SelectValue {
  value: string;
  label: string;
}

interface Record {
  specialty: string;
  name: string;
  notaTO: number;
  programaGoverno: boolean;
  notaFinal: number;
  ranking: number;
}

const FUNDATEC_URL =
  'https://fundatec.org.br/portal/concursos/924/classificacao_instituicao_895aee7b65sfvv1ewddasggr9fcb.php?concurso=924';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractTableData(page: Page, specialty: string): Promise<Record[]> {
  return page.evaluate((specialtyValue) => {
    // Get the specific table with class bordaCinza
    const table = document.querySelector('table.bordaCinza');
    if (!table) return [];

    // Get all rows from tbody, skip header (first row)
    const rows = Array.from(table.querySelectorAll('tbody tr')).slice(1);

    // Process only odd-indexed rows (skip separators)
    return rows
      .filter((_, index) => index % 2 === 1)
      .map((row) => {
        const cells = Array.from(row.querySelectorAll('td'));
        return {
          specialty: specialtyValue,
          name: cells[0]?.textContent?.trim() || '',
          notaTO: parseFloat(cells[4]?.textContent?.replace(',', '.') || '0'),
          programaGoverno: cells[6]?.textContent?.trim()?.toLowerCase() === 'sim',
          notaFinal: parseFloat(cells[8]?.textContent?.replace(',', '.') || '0'),
          ranking: parseInt(cells[10]?.textContent?.trim() || '0', 10),
        };
      });
  }, specialty);
}

async function main() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: 'shell',
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  try {
    // Create a new page
    const page = await browser.newPage();

    // Set viewport to a large size (optional since we're using defaultViewport: null)
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // Navigate to the URL
    await page.goto(FUNDATEC_URL);

    // Wait for the select element to be present
    await page.waitForSelector('select[name="cargo"]');

    // Select the option using the select element's value
    await page.select('select[name="cargo"]', '2');

    // Click the consultation button
    await page.click('input[name="image"]');

    // Wait for the specialties select to be present
    await page.waitForSelector('select[name="especialidade"]');

    // Extract all options from the specialties select
    const specialties: SelectValue[] = await page.evaluate(() => {
      const select = document.querySelector('select[name="especialidade"]') as HTMLSelectElement;
      const options = Array.from(select.options);
      // Skip the first option (placeholder) and map the rest
      return options.slice(1).map((option) => ({
        value: option.value,
        label: option.text.trim(),
      }));
    });

    // Write specialties to a JSON file
    const outputPath = join(process.cwd(), 'data');
    await writeFile(join(outputPath, 'specialties.json'), JSON.stringify(specialties, null, 2));

    console.log(`Processing ${specialties.length} specialties`);

    // Extract data for each specialty
    const allRecords: Record[] = [];

    for (const specialty of specialties) {
      console.log(`Extracting data for specialty: ${specialty.label}`);

      // Select the specialty
      await page.select('select[name="especialidade"]', specialty.value);

      // Click the consultation button
      await page.click('input[name="image2"]');

      // Wait for the table to load
      await page.waitForNetworkIdle();

      // Extract table data
      const records = await extractTableData(page, specialty.value);
      allRecords.push(...records);

      console.log(`Found ${records.length} records for ${specialty.label}`);

      // Small delay to avoid overwhelming the server
      await sleep(500);
    }

    // Sort all records by ranking
    allRecords.sort((a, b) => a.ranking - b.ranking);

    // Write records to a JSON file
    await writeFile(join(outputPath, 'records.json'), JSON.stringify(allRecords, null, 2));

    console.log(`Extracted ${allRecords.length} total records`);
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  } finally {
    // Make sure to close the browser
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
