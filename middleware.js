// Password lock for harrissalat.com/oyaji (and every file under it).
// Runs on Vercel before the page is served. To change the password, edit
// the PASSWORD line and push. After a correct password the browser gets a
// cookie, so the images and video load without being asked again.

const PASSWORD = 'Flashy!';
const COOKIE = 'oyaji_ok';
const TOKEN = 'flashy-2026-09';

export const config = {
  matcher: ['/oyaji', '/oyaji/:path*'],
};

export default function middleware(request) {
  const cookies = request.headers.get('cookie') || '';
  if (cookies.split(';').some(c => c.trim() === COOKIE + '=' + TOKEN)) {
    return; // already let in
  }

  const header = request.headers.get('authorization') || '';
  let message = 'This page needs a password.';

  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    const supplied = decoded.slice(decoded.indexOf(':') + 1).trim();
    if (supplied === PASSWORD) {
      // Remember the visitor for 30 days, then reload the same address.
      return new Response(null, {
        status: 302,
        headers: {
          'Location': request.url,
          'Set-Cookie': COOKIE + '=' + TOKEN + '; Path=/oyaji; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax',
          'Cache-Control': 'no-store',
        },
      });
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
