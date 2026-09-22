import fs from 'fs';
import path from 'path';
import { generateKAKPdf } from '../src/lib/pdf/generatePdf';
import { defaultKAKData } from '../src/data/initialData';

async function main() {
  const templatePath = path.resolve('public/template.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  console.log('Generating sample PDF using defaultKAKData...');
  const finalPdfBytes = await generateKAKPdf(defaultKAKData, {
    templateBytes: new Uint8Array(templateBytes),
  });

  const outDir = path.resolve('analysis');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'sample_output.pdf');
  fs.writeFileSync(outPath, Buffer.from(finalPdfBytes));
  console.log(`Successfully generated sample PDF at: ${outPath} (${finalPdfBytes.length} bytes)`);
}

main().catch((err) => {
  console.error('Error generating sample PDF:', err);
  process.exit(1);
});
