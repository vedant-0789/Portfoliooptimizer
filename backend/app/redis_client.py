"""Redis client for caching and real-time data"""

import redis.asyncio as redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")


class RedisClient:
    def __init__(self):
        self.client = None

    async def connect(self):
        """Connect to Redis"""
        self.client = await redis.from_url(REDIS_URL, decode_responses=True)
        print("✅ Connected to Redis")

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.client:
            await self.client.close()
            print("✅ Disconnected from Redis")

    async def get(self, key: str):
        """Get value from Redis"""
        if self.client:
            return await self.client.get(key)
        return None

    async def set(self, key: str, value: str, ex: int = 3600):
        """Set value in Redis with expiration"""
        if self.client:
            await self.client.set(key, value, ex=ex)

    async def delete(self, key: str):
        """Delete key from Redis"""
        if self.client:
            await self.client.delete(key)


redis_client = RedisClient()

