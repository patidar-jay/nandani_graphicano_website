import https from 'https';

// Check which JS hash is currently served by Vercel
https.get('https://nandani-graphicano-website.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      console.log('Current deployed JS file:', match[1]);
      console.log('Expected (from last build): /assets/index-p3JtRFWB.js');
      if (match[1] === '/assets/index-p3JtRFWB.js') {
        console.log('✅ LATEST CODE IS DEPLOYED');
      } else {
        console.log('❌ OLD CODE STILL DEPLOYED - Vercel has not finished yet');
      }
    }
  });
});
