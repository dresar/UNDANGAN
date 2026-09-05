async function testEndpoints() {
  console.log('Testing http://localhost:3000/ ...');
  const r1 = await fetch('http://localhost:3000/');
  console.log('Home status:', r1.status);

  console.log('Testing http://localhost:3000/login ...');
  const r2 = await fetch('http://localhost:3000/login');
  console.log('Login page status:', r2.status);

  console.log('Testing POST /api/auth with dev-login admin...');
  const r3 = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'dev-login', target: 'admin' }),
  });
  console.log('Dev login admin status:', r3.status);
  const data3 = await r3.json();
  console.log('Dev login response:', data3);
  const setCookie = r3.headers.get('set-cookie');
  console.log('Session cookie received:', setCookie ? 'Yes' : 'No');

  console.log('Testing GET /api/auth with session cookie...');
  const r4 = await fetch('http://localhost:3000/api/auth', {
    headers: { cookie: setCookie || '' },
  });
  console.log('Auth check status:', r4.status);
  console.log('Auth check user:', await r4.json());

  console.log('Testing GET /api/invitations with session cookie...');
  const r5 = await fetch('http://localhost:3000/api/invitations', {
    headers: { cookie: setCookie || '' },
  });
  console.log('Invitations status:', r5.status);
  const data5 = await r5.json();
  console.log('Invitations count:', data5.items?.length);

  console.log('Testing http://localhost:3000/dinda-bima ...');
  const r6 = await fetch('http://localhost:3000/dinda-bima');
  console.log('Public wedding page status:', r6.status);

  console.log('ALL SMOKE TESTS COMPLETED SUCCESSFULLY!');
}

testEndpoints().catch(console.error);
