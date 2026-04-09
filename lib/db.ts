import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

interface Session {
  id: string;
  title: string;
  date: string;
  type: 'Quiz' | 'Flash';
  data: any;
}

interface DB {
  profile: UserProfile;
  history: Session[];
}

const defaultDB: DB = {
  profile: {
    name: "Sahil",
    email: "sahil@example.com",
    bio: "AI Learning Enthusiast"
  },
  history: []
};

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
  }
}

export async function getDb(): Promise<DB> {
  ensureDbExists();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function saveProfile(profile: UserProfile) {
  const db = await getDb();
  db.profile = profile;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return db.profile;
}

export async function addSession(session: Omit<Session, 'id' | 'date'>) {
  const db = await getDb();
  const newSession: Session = {
    ...session,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toLocaleString()
  };
  db.history.unshift(newSession);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return newSession;
}

export async function deleteSession(id: string) {
  const db = await getDb();
  db.history = db.history.filter(s => s.id !== id);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return { success: true };
}
