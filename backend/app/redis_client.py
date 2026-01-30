"""Redis client for caching and real-time data"""

import redis.asyncio as redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")


class RedisClient:
    def __init__(self):
        self.client = None
        self.memory_cache = {}
        self.use_memory = False

    async def connect(self):
        """Connect to Redis"""
        try:
            self.client = await redis.from_url(REDIS_URL, decode_responses=True)
            # Test connection
            await self.client.ping()
            print("Connected to Redis")
        except Exception as e:
            print(f"Redis connection failed: {e}")
            print("Using in-memory cache fallback")
            self.use_memory = True

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.client:
            await self.client.close()
            print("Disconnected from Redis")

    async def get(self, key: str):
        """Get value from Redis"""
        if self.use_memory:
            return self.memory_cache.get(key)
        if self.client:
            return await self.client.get(key)
        return None

    async def set(self, key: str, value: str, ex: int = 3600):
        """Set value in Redis with expiration"""
        if self.use_memory:
            self.memory_cache[key] = value
            # Note: Expiration not implemented for memory cache in this simple fallback
        elif self.client:
            await self.client.set(key, value, ex=ex)

    async def delete(self, key: str):
        """Delete key from Redis"""
        if self.use_memory:
            self.memory_cache.pop(key, None)
        elif self.client:
            await self.client.delete(key)


redis_client = RedisClient()

