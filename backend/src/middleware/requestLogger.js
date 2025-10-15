export function requestLogger(req, res, next) {
  // very light request log; morgan handles detailed logs
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
}

