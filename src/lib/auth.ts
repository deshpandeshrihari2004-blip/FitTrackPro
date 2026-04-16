import * as jose from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-key-for-fittrack-local-dev-only'
);

export async function signToken(payload: { userId: string; email: string }) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return jwt;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return null;
  return verifyToken(token.value);
}
