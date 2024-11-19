import type { ItemPayload } from '@renderer/types/items'
import type { Statement } from 'better-sqlite3'
import db from './database'
import {
  DELETE_ALL_ITEMS,
  DELETE_ITEM,
  DELETE_ITEMS_BY_ID,
  GET_ITEM_BY_ID,
  SEARCH_ITEMS,
  UPDATE_ITEM
} from './queries/items'

export function getAllItems(): Promise<ItemPayload[]> {
  return new Promise((resolve, reject) => {
    try {
      const stmt: Statement<ItemPayload[], ItemPayload> = db.prepare('SELECT * FROM items')
      const items = stmt.all().map((item) => ({
        ...item,
        isSelected: Boolean(item.isSelected)
      }))
      resolve(items)
    } catch (err) {
      reject(err)
    }
  })
}

export function addItem(item: ItemPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(() => {
        const insertItem = db.prepare(`
          INSERT INTO items (isSelected, bar_code, item_name, quantity)
          VALUES (?, ?, ?, ?)
        `)
        insertItem.run(item.isSelected, item.bar_code, item.item_name, item.quantity)
      })

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function removeAllItems(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      db.prepare(DELETE_ALL_ITEMS).run()

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function removeItem(itemId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const changes = db.prepare(DELETE_ITEM).run(itemId).changes

      if (changes > 0) {
        resolve()
      } else {
        reject(new Error('Item not found'))
      }
    } catch (error) {
      reject(error)
    }
  })
}

export function removeSelectedItems(itemIds: number[]): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(DELETE_ITEMS_BY_ID)

      db.transaction(() => {
        itemIds.forEach((id) => {
          stmt.run(id)
        })
      })

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function changeItem(item: ItemPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const { bar_code, item_name, quantity, id } = item
      // UPDATE_ITEM
      db.prepare(
        `
        UPDATE items
        SET bar_code = ?,
            item_name = ?, 
            quantity = ?
        WHERE id = ?
      `
      ).run(bar_code, item_name, quantity, id)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function searchItems(query: string): Promise<ItemPayload[]> {
  return new Promise((resolve, reject) => {
    try {
      const stmt: Statement<string, ItemPayload> = db.prepare(SEARCH_ITEMS)

      const items = stmt.all(query)

      const parsedItems = items.map((item) => ({
        ...item,
        isSelected: Boolean(item.isSelected)
      }))

      resolve(parsedItems)
    } catch (error) {
      reject(error)
    }
  })
}

export function newProductWindowWithItem(id: number): Promise<ItemPayload> {
  return new Promise((resolve, reject) => {
    try {
      const stmt: Statement<number, ItemPayload> = db.prepare(GET_ITEM_BY_ID)
      const item = stmt.get(id)

      if (item) {
        resolve(item)
      } else {
        reject(new Error('Item not found'))
      }
    } catch (error) {
      reject(error)
    }
  })
}
