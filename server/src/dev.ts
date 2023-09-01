import express from 'express';
import path from 'path';

const webPath = 'www';

function main() {
  const app = express();
  app.use(express.static(path.resolve(webPath)));
  app.get('*', (req, res) => res.sendFile(path.resolve(webPath, 'index.html')));
  app.listen(9993);
  console.log(9993);
}

main();
