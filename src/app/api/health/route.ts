/** Liveness check for hosting platforms. Deliberately reveals nothing about the system. */
export function GET() {
  return Response.json({ ok: true });
}
