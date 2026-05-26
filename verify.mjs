import https from 'https';

https.get('https://nandani-graphicano-website.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (match) {
      console.log('Current deployed JS:', match[1]);
      console.log('Expected:', '/assets/index-HgJUpvg4.js');
      if (match[1] === '/assets/index-HgJUpvg4.js') {
        console.log('✅ LATEST CODE IS DEPLOYED');
      } else {
        console.log('❌ OLD CODE STILL DEPLOYED');
      }
    }
  });
});
