const isAuthorized = (req: any) => {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return true;
  return req.headers?.['x-admin-key'] === expected;
};

const getBody = async (req: any): Promise<any> => {
  if (req.body) return req.body;
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const body = await getBody(req);
    const inputUrl = body.inputUrl as string | undefined;
    if (!inputUrl) {
      res.status(400).json({ error: 'inputUrl is required' });
      return;
    }

    const { createMuxAssetFromUrl } = await import('../../server/mux');
    const asset = await createMuxAssetFromUrl(inputUrl);
    res.status(200).json({ ok: true, asset });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to create Mux asset' });
  }
}
