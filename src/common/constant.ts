export const MetadataKey = {
  REDIS: 'redis',
  ROLES: 'roles',
};

export const TokenExpires = {
  accessToken: '30m',
  refreshToken: '30d',
  redisAccessToken: 60 * 30,
  redisRefreshToken: 60 * 60 * 24 * 30,
};
