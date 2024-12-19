import type { ItemPayload } from '@renderer/types/items'
import type { Statement } from 'better-sqlite3'
import db from './database'
import {
  DELETE_ALL_ITEMS,
  DELETE_ITEMS_BY_ID,
  GET_ALL_ITEMS_WITH_SPECIFIC_KEY,
  GET_ALL_ITEMS_BY_CATEGORY,
  GET_ITEM_BY_ID,
  SEARCH_ITEMS,
} from './queries/items'

export function getAllItems(category = ""): Promise<ItemPayload[]> {
  return new Promise((resolve, reject) => {
    
    try {
      const SUITABLE_QUERY = category ? GET_ALL_ITEMS_BY_CATEGORY : GET_ALL_ITEMS_WITH_SPECIFIC_KEY
      const params = category ? { category } : {};


      const stmt: Statement<any, ItemPayload> = db.prepare(
        SUITABLE_QUERY
      )
      const items = stmt.all(params).map((item) => ({
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
      const insertItem = db.prepare(`
          INSERT INTO items (isSelected, bar_code, item_name, quantity, purchase_price, selling_price, serial_number, caliber)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)

      insertItem.run(
        item.isSelected ? 1 : 0,
        item.bar_code,
        item.item_name,
        item.quantity,
        item.purchase_price,
        item.selling_price,
        item.serial_number,
        item.caliber
      )

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

export function removeSelectedItems(itemIds: number[]): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(DELETE_ITEMS_BY_ID)

      itemIds.forEach((id) => {
        stmt.run(id)
      })

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function updateItem(item: ItemPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const stmt = db.prepare(`UPDATE items SET
      isSelected = ?,
      bar_code = ?,
      item_name = ?,
      quantity = ?,
      purchase_price = ?,
      selling_price = ?,
      serial_number = ?,
      caliber = ?
      WHERE id = ?`)

      stmt.run(
        item.isSelected ? 1 : 0,
        item.bar_code,
        item.item_name,
        item.quantity,
        item.purchase_price,
        item.selling_price,
        item.serial_number,
        item.caliber,
        item.id
      )

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

export function getItemById(id: number): Promise<ItemPayload> {
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
