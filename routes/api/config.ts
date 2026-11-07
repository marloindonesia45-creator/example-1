import { defineHandler } from 'nitro/h3';
import { getServerEnvironment, jsonResponse } from '../../lib/serverAuth';

export default defineHandler((event) => {
  const environment = getServerEnvironment(event.req, event.context);
  return jsonResponse(200, {
    GOOGLE_APPS_SCRIPT_URL: environment.GOOGLE_APPS_SCRIPT_URL ?? '',
  });
});
