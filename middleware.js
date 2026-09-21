// Password lock for harrissalat.com/oyaji (and every file under it).
// Runs on Vercel before the page is served. The password is read from the
// OYAJI_PASSWORD setting in the Vercel dashboard, so it never lives in this repo.

export const config = {
  matcher: ['/oyaji', '/oyaji/:path*'],
};

export default function middleware(request) {
  const expected = (process.env.OYAJI_PASSWORD || '').trim();
  const header = request.headers.get('authorization') || '';

  let message = 'This page needs a password.';

  if (!expected) {
    message = 'The password setting (OYAJI_PASSWORD) is not set up on Vercel yet.';
  } else if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    // Browser sends "username:password"; the username can be anything.
    const supplied = decoded.slice(decoded.indexOf(':') + 1).trim();
    if (supplied === expected) {
      return; // let the request through
    }
    message = 'Wrong password. The username can be anything.';
  }

  return new Response(message, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Oyaji Bros", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
