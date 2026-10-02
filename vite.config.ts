import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost:3000');
        const pathname = url.pathname;

        // Enhance res with status and json helpers if missing
        const enhancedRes = res as any;
        if (!enhancedRes.status) {
          enhancedRes.status = function (statusCode: number) {
            enhancedRes.statusCode = statusCode;
            return enhancedRes;
          };
        }
        if (!enhancedRes.json) {
          enhancedRes.json = function (data: any) {
            enhancedRes.setHeader('Content-Type', 'application/json');
            enhancedRes.end(JSON.stringify(data, null, 2));
            return enhancedRes;
          };
        }
        if (!enhancedRes.send) {
          enhancedRes.send = function (data: any) {
            enhancedRes.end(data);
            return enhancedRes;
          };
        }

        // Attach parsed query parameters to req
        const query: Record<string, string> = {};
        url.searchParams.forEach((val, key) => {
          query[key] = val;
        });
        (req as any).query = query;

        try {
          if (pathname === '/api/health' || pathname === '/api/health.js') {
            const { default: healthHandler } = await import('./api/health.js');
            return await healthHandler(req, enhancedRes);
          } else if (
            pathname === '/api/crowd' ||
            pathname === '/api/crowd.js' ||
            pathname === '/api/pcd-realtime' ||
            pathname === '/api/pcd-realtime.js'
          ) {
            const { default: crowdHandler } = await import('./api/crowd.js');
            return await crowdHandler(req, enhancedRes);
          }
          next();
        } catch (err: any) {
          enhancedRes.status(500).json({ error: 'Internal API Server Error', details: err?.message });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

