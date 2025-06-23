const cache = new Map();

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse && Date.now() - cachedResponse.timestamp < duration * 1000) {
      return res.json(cachedResponse.data);
    }

    // Store original res.json method
    const originalJson = res.json;

    // Override res.json method to cache the response
    res.json = function(data) {
      cache.set(key, {
        data: data,
        timestamp: Date.now()
      });

      // Call original method
      originalJson.call(this, data);
    };

    next();
  };
};

// Clear cache periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > 300000) { // 5 minutes
      cache.delete(key);
    }
  }
}, 300000);

module.exports = cacheMiddleware; 