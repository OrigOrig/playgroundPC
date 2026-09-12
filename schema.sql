CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS builds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT NOT NULL,
  cpu TEXT NOT NULL,
  gpu TEXT NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  psu TEXT NOT NULL,
  monitor TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'private',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  low_fps INTEGER NOT NULL,
  medium_fps INTEGER NOT NULL,
  high_fps INTEGER NOT NULL,
  ultra_fps INTEGER NOT NULL,
  vram TEXT NOT NULL,
  cpu_load INTEGER NOT NULL,
  gpu_load INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'Game'
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_builds_user ON builds(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

INSERT OR IGNORE INTO games (slug,title,image,low_fps,medium_fps,high_fps,ultra_fps,vram,cpu_load,gpu_load) VALUES
('cyberpunk-2077','Cyberpunk 2077','cp',67,48,37,25,'6.1 GB',64,91),
('gta-v','GTA V','gta',128,110,92,71,'4.8 GB',52,78),
('minecraft','Minecraft','mc',220,200,180,140,'2.1 GB',38,43),
('fortnite','Fortnite','fort',112,94,76,61,'3.4 GB',48,62),
('valorant','Valorant','val',240,180,120,100,'2.8 GB',42,55),
('forza-horizon-5','Forza Horizon 5','forza',92,79,65,49,'4.2 GB',58,76),
('call-of-duty-warzone','Call of Duty: Warzone','cod',74,64,52,39,'5.6 GB',61,88),
('red-dead-redemption-2','Red Dead Redemption 2','rdr',67,56,46,34,'5.1 GB',57,82);
