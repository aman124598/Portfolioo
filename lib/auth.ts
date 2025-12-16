import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

export interface AuthUser {
  username: string;
}

export async function verifyPassword(password: string): Promise<boolean> {
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function createToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

export function login(username: string, password: string): string | null {
  if (username !== ADMIN_USERNAME) return null;
  if (!bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) return null;
  
  return createToken({ username });
}
