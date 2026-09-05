async function testAdminRoutes() {
  const routes = [
    '/admin/dashboard',
    '/admin/templates',
    '/admin/invitations',
    '/admin/invitations/create',
    '/admin/themes',
    '/admin/components',
    '/admin/assets',
    '/admin/ai-studio',
  ];

  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`);
    console.log(`Route ${r} -> Status ${res.status}`);
  }
}

testAdminRoutes().catch(console.error);
