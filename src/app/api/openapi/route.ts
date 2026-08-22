export async function GET() {
  return Response.json({
    openapi: '3.0.3',
    info: { title: 'OptiTalent API', version: '1.0.0' },
    servers: [{ url: '/api' }],
    paths: {
      '/health': {
        get: {
          summary: 'Liveness',
          responses: { '200': { description: 'OK' } },
        },
      },
      '/tenants/provision': {
        post: {
          summary: 'Provision tenant (requires configured Supabase)',
          responses: {
            '401': { description: 'Unauthorized' },
            '503': { description: 'Not configured' },
          },
        },
      },
    },
  });
}
