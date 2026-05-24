import https from 'https';

https.get('https://nandani-graphicano-website.vercel.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src=\"(\/assets\/index-[^\"]+\.js)\"/);
    if (match) {
      const jsUrl = 'https://nandani-graphicano-website.vercel.app' + match[1];
      console.log('JS URL:', jsUrl);
      https.get(jsUrl, (jsRes) => {
        let jsData = '';
        jsRes.on('data', chunk => jsData += chunk);
        jsRes.on('end', () => {
          if (jsData.includes('wa.me')) {
            console.log('CODE DEPLOYED SUCCESSFULLY');
          } else {
            console.log('OLD CODE STILL SERVED');
          }
        });
      });
    } else {
      console.log('No JS file found');
    }
  });
});
