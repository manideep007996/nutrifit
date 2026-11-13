import { storage, delay, uid } from './storage';

// LOCAL-ONLY auth for prototyping. Passwords are hashed but this is NOT
// secure — real auth must happen on the server.
// Backend swap: POST /auth/register, POST /auth/login, POST /auth/logout, GET /auth/me

const USERS = 'users';
const SESSION = 'session';

async function hash(text) {
  if (crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
  return String(h);
}

const publicUser = ({ passwordHash, ...rest }) => rest;

export async function register({ name, email, password }) {
  await delay();
  const users = storage.get(USERS, []);
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    throw new Error('An account with this email already exists.');
  }
  const user = {
    id: uid(),
    name: name.trim(),
    email: normalized,
    passwordHash: await hash(password),
    createdAt: new Date().toISOString(),
  };
  storage.set(USERS, [...users, user]);
  return publicUser(user);
}

export async function login(email, password) {
  await delay();
  const users = storage.get(USERS, []);
  const user = users.find((u) => u.email === email.trim().toLowerCase());
  if (!user || user.passwordHash !== (await hash(password))) {
    throw new Error('Incorrect email or password.');
  }
  storage.set(SESSION, { userId: user.id, token: uid(), createdAt: new Date().toISOString() });
  return publicUser(user);
}

export async function logout() {
  await delay(100);
  storage.remove(SESSION);
}

export async function getCurrentUser() {
  const session = storage.get(SESSION);
  if (!session) return null;
  const user = storage.get(USERS, []).find((u) => u.id === session.userId);
  return user ? publicUser(user) : null;
}
