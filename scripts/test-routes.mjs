async function testAllRoutes() {
  const cookie = 'undangan_session=' + (await (await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'dev-login', target: 'admin' }),
  })).json()).user.userId;

  const routes = [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/create',
    '/editor/9c1acddf-0592-4f1e-89a8-07d6eea2acca',
    '/dinda-bima',
    '/budi-ani',
    '/romeo-juliet',
  ];

  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`);
    console.log(`Route ${r} -> Status ${res.status}`);
  }
}

testAllRoutes().catch(console.error);
