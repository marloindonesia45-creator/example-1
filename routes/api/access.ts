import {
  defineHandler,
} from 'nitro/h3';
import {
  clearSessionCookie,
  createSessionCookie,
  getServerEnvironment,
  isSameOrigin,
  jsonResponse,
  passwordMatches,
  readJsonBody,
} from '../../lib/serverAuth';

export default defineHandler(async (event) => {
  const request = event.req;
  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  }
  if (!isSameOrigin(request)) {
    return jsonResponse(403, { error: 'Request origin is not allowed.' });
  }

  try {
    const environment = getServerEnvironment(request);
    const body = await readJsonBody(request);
    if (!environment.APP_SESSION_SECRET || !environment.APP_ACCESS_PASSWORD) {
      return jsonResponse(503, { error: 'Server access credentials are not configured.' });
    }
    if (!passwordMatches(body.password, environment)) {
      return jsonResponse(401, { error: 'Password salah. Coba lagi.' });
    }

    return jsonResponse(200, { ok: true }, { 'Set-Cookie': createSessionCookie(environment) });
  } catch (error) {
    console.error('Access authentication failed:', error);
    const isInvalidBody = error instanceof Error && error.message.includes('Request body');
    return jsonResponse(
      isInvalidBody ? 400 : 500,
      { error: isInvalidBody ? error.message : 'Gagal memverifikasi akses.' },
      { 'Set-Cookie': clearSessionCookie(getServerEnvironment(request)) },
    );
  }
});
