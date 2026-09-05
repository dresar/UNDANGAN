import crypto from 'crypto';

const stored = 'd248e4a4afa63076ea3dc1fbbee02e6c:a4f0f12e1dce2c1eaf7065ea27e8499b9afed803cac1247620f4676f47b71d1f';
const [salt, hash] = stored.split(':');
const pw = 'Admin#Dev2026';

// Test sha256 with salt
const h1 = crypto.createHash('sha256').update(salt + pw).digest('hex');
console.log('sha256(salt+pw):', h1, h1 === hash);
const h2 = crypto.createHash('sha256').update(pw + salt).digest('hex');
console.log('sha256(pw+salt):', h2, h2 === hash);

// Test pbkdf2
const h3 = crypto.pbkdf2Sync(pw, salt, 1000, 32, 'sha256').toString('hex');
console.log('pbkdf2Sync:', h3, h3 === hash);
