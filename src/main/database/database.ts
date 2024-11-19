import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import Database, { Database as DatabaseType } from 'better-sqlite3'

import { CREATE_ITEM_TABLE } from './queries/items'

// import { type Database as DatabaseType } from 'sqlite3'

const appPath = app.getAppPath().replace('app.asar', 'items.sqlite')
const devPath = join(app.getAppPath(), 'items.db')

const dbPath = is.dev ? devPath : appPath

const db: DatabaseType = new Database(dbPath, { verbose: console.log })

const createTables = db.transaction(() => {
  db.exec(CREATE_ITEM_TABLE)

  db.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT,
      address TEXT,
      phone TEXT,
      email TEXT
    );
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_items_bar_code ON items (bar_code);
    CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers (name);
  `)
})

try {
  createTables()
} catch (error) {
  console.error(error)
  throw error
}

export default db
