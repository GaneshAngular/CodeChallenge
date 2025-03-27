// import redis from 'redis'

// const redisClient = redis.createClient({
//     username: 'default',
//     password: process.env.REDIS_PASSWORD,
//     host: 'redis-14850.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
//     port: 14850

// })


// export default redisClient;

import { createClient } from 'redis';

const redisClient = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  socket: {
    reconnectStrategy: (retries) => {
      // Reconnect after 5 seconds max
      return Math.min(retries * 100, 5000);
    }
  }
});

// Handle connection events
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));

// Ensure connection is established before exporting
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();

export default redisClient;