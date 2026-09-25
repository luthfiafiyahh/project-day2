import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { generateKAKPdfFromDocx, renderKAKDocxBuffer } from './src/server/pdfService.ts';

function pdfApiPlugin(): Plugin {
  return {
    name: 'pdf-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/generate-pdf' && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const data = JSON.parse(bodyStr);
                const pdfBuffer = await generateKAKPdfFromDocx(data);
                res.writeHead(200, {
                  'Content-Type': 'application/pdf',
                  'Content-Length': pdfBuffer.length,
                });
                res.end(pdfBuffer);
              } catch (err: any) {
                console.error('API /api/generate-pdf error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err?.message || 'Gagal generate PDF' }));
              }
            });
          } catch (err: any) {
            next(err);
          }
          return;
        }

        if (req.url === '/api/generate-docx' && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const data = JSON.parse(bodyStr);
                const docxBuffer = await renderKAKDocxBuffer(data);
                res.writeHead(200, {
                  'Content-Type':
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'Content-Length': docxBuffer.length,
                });
                res.end(docxBuffer);
              } catch (err: any) {
                console.error('API /api/generate-docx error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err?.message || 'Gagal generate DOCX' }));
              }
            });
          } catch (err: any) {
            next(err);
          }
          return;
        }

        if (req.url === '/api/chat' && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            req.on('end', async () => {
              try {
                const bodyStr = Buffer.concat(chunks).toString('utf-8');
                const aiRes = await fetch('https://ukisai.com/api/swift/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer none',
                  },
                  body: bodyStr,
                });
                const aiData = await aiRes.text();
                res.writeHead(aiRes.status, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                });
                res.end(aiData);
              } catch (err: any) {
                console.error('API /api/chat error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err?.message || 'Gagal proxy AI' }));
              }
            });
          } catch (err: any) {
            next(err);
          }
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pdfApiPlugin()],
});
