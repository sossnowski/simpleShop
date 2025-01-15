import app from 'app';

const port = process.env.PORT;

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Connected successfully on port ${port}`);
});

process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.info('SIGTERM received');
  if (server) server.close();
});
