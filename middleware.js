// Password lock for harrissalat.com/oyaji (and every file under it).
// Runs on Vercel before the page is served. To change the password, edit
// the line below and push.

const PASSWORD = 'Flashy!';

export const config = {
  matcher: ['/oyaji', '/oyaji/:path*'],
};

export default function middleware(request) {
  const header = request.headers.get('authorization') || '';
  let message = 'This page needs a password.';

  if (header.startsWith('Basic ')) {
    let decoded = '';
    try { decoded = atob(header.slice(6)); } catch (e) { decoded = ''; }
    // Browser sends "username:password"; the username can be anything.
    const supplied = decoded.slice(decoded.indexOf(':') + 1).trim();
    if (supplied === PASSWORD) {
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
