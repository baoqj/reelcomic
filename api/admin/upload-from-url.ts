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
    const sourceUrl = body.sourceUrl as string | undefined;
    const pathname = body.pathname as string | undefined;
    if (!sourceUrl || !pathname) {
      res.status(400).json({ error: 'sourceUrl and pathname are required' });
      return;
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      res.status(400).json({ error: 'Failed to download source asset' });
      return;
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const blob = await response.blob();
    const { uploadAssetToBlob } = await import('../../server/blob');
    const uploaded = await uploadAssetToBlob(pathname, blob);

    res.status(200).json({
      ok: true,
      contentType,
      blob: uploaded,
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to upload blob asset' });
  }
}
