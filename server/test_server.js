import http from 'http';

function checkEndpoint(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data.substring(0, 150) });
      });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function runTests() {
  console.log('Testing KITCHENcraft server endpoints:');
  const catRes = await checkEndpoint('/api/materials/categories');
  console.log('/api/materials/categories:', catRes);

  const matRes = await checkEndpoint('/api/materials?category=countertops');
  console.log('/api/materials?category=countertops:', matRes);

  const htmlRes = await checkEndpoint('/');
  console.log('GET / (SPA Home):', htmlRes);
}

runTests();
