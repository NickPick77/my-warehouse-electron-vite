import { Database } from 'sqlite3'
import { type Database as DatabaseType } from 'sqlite3'

const createDb = (path: string) => {
  const dbPath = path
  const db: DatabaseType = new Database(dbPath)

  db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isSelected INTEGER NOT NULL,
        bar_code TEXT,
        item_name TEXT NOT NULL,
        quantity INTEGER
      )
    `)

  return db
}
export default createDb
