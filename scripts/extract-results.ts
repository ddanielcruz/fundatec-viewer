import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import puppeteer from 'puppeteer';

interface SelectValue {
  value: string;
  label: string;
}

const FUNDATEC_URL =
  'https://fundatec.org.br/portal/concursos/924/classificacao_instituicao_895aee7b65sfvv1ewddasggr9fcb.php?concurso=924';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false,
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

    console.log(`Extracted ${specialties.length} specialties`);

    // Wait for 3 seconds to see the results
    await sleep(3000);
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
