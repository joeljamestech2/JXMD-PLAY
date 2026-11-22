# Music Platform starter

## Deploy
1. Install dependencies: `npm install`
2. Set Vercel Environment Variables `MEGA_EMAIL` and `MEGA_PASSWORD` to your MEGA login credentials.
3. Deploy this project to Vercel.

**Do not commit MEGA credentials.** Credentials are intentionally read from environment variables rather than embedded in files or the ZIP.

## Endpoints
- `POST /api/user/create` with JSON `{ "username", "email", "password" }`
- `GET /api/userhistory?userId=...`
- `POST /api/userhistory` with JSON `{ "userId", "type", "details" }`
- `GET /api/ytsearch?q=search terms`
- `GET /api/ytmp3?url=YOUTUBE_URL`
- `GET /api/ytmp4?url=YOUTUBE_URL`

## Routes
- `/` or `/dashboard`
- `/mp3`
- `/mp4`
- SEO-style audio/video paths are routed to the matching template page; detail content wiring is a next step.

## Storage note
MEGA helper uses JSON files in MEGA folders (`users`, `history`). This initial scaffold is not a production-ready authentication system: account creation currently uses SHA-256 password hashing, which should be upgraded to a salted password hash and login/session protections before public launch. Concurrent write handling is also not implemented.
