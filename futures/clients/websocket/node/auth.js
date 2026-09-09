const crypto = require('node:crypto');

function normalizeSubaccountId(subaccountId) {
  if (subaccountId === undefined || subaccountId === null) {
    return undefined;
  }
  const value = String(subaccountId).trim();
  if (!value) {
    return undefined;
  }
  if (!/^\d+$/.test(value)) {
    throw new Error('subaccountId must be a numeric account ID');
  }
  return value;
}

function buildSignaturePayload(timestamp, subaccountId) {
  if (!Number.isSafeInteger(timestamp)) {
    throw new Error('timestamp must be a safe integer in milliseconds');
  }
  const payload = { timestamp };
  const normalizedSubaccountId = normalizeSubaccountId(subaccountId);
  if (normalizedSubaccountId) {
    payload.subaccountId = normalizedSubaccountId;
  }
  return JSON.stringify(payload);
}

function createApiKeyAuth({
  apiKey,
  secretKey,
  subaccountId,
  timestamp = Date.now()
}) {
  const normalizedApiKey = typeof apiKey === 'string'
    ? apiKey.trim()
    : '';
  if (!normalizedApiKey || typeof secretKey !== 'string' || !secretKey) {
    throw new Error('apiKey and secretKey are required');
  }
  const normalizedSubaccountId = normalizeSubaccountId(subaccountId);
  const payload = buildSignaturePayload(timestamp, normalizedSubaccountId);
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload, 'utf8')
    .digest('hex');

  return {
    clientType: 'api',
    apiKey: normalizedApiKey,
    signature,
    timestamp,
    ...(normalizedSubaccountId
      ? { subaccountId: normalizedSubaccountId }
      : {})
  };
}

module.exports = {
  buildSignaturePayload,
  createApiKeyAuth,
  normalizeSubaccountId
};
