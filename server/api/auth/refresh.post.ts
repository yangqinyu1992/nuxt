import { H3Event } from 'h3';
import { signToken, verifyToken } from '../../utils/auth';

function getJwtSecret(event: H3Event): string {
  const config = useRuntimeConfig(event);
  return config.jwtSecret;
}

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token');

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Refresh token not found',
    });
  }

  const secret = getJwtSecret(event);

  try {
    const payload = verifyToken(refreshToken, secret);
    const newAccessToken = signToken({ uid: payload.uid, username: payload.username }, secret, '15m');

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid refresh token',
    });
  }
});
