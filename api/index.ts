import serverless from 'serverless-http';

let handler: ReturnType<typeof serverless> | undefined;

export default async function vercelHandler(
  event: object,
  context: object
): Promise<object> {
  if (!handler) {
    const { createApp } = await import('../server/dist/app.js');
    handler = serverless(createApp());
  }
  return handler(event, context);
}
