export const DAYS_30 = 30 * 24 * 60 * 60 * 1000;
export const UserAPI = `${Deno.env.get('USER_SERVICE') || 'http://localhost:8000'}/users`