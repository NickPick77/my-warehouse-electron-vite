/**
 * Query per creare, se non esistente,la tabella items database.
 */
export const CREATE_ITEM_TABLE = `
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      isSelected INTEGER NOT NULL,
      bar_code TEXT UNIQUE,
      item_name TEXT NOT NULL,
      quantity INTEGER,
      caliber TEXT,
      serial_number TEXT UNIQUE,
      manufacturer TEXT,
      purchase_price REAL,
      selling_price REAL,
      supplier_id INTEGER,
      product_status TEXT,
      product_image TEXT,
      included_accessories TEXT,
      additional_notes TEXT,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    )
  `

export const INSERT_ITEM = `
  INSERT INTO items (isSelected, bar_code, item_name, quantity, caliber, serial_number, manufacturer, purchase_price, selling_price, supplier_id, product_status, product_image, included_accessories, additional_notes)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

export const DELETE_ITEM = `
    DELETE FROM items WHERE id = ?
    `
export const DELETE_ALL_ITEMS = `
    DELETE FROM items
  `

export const DELETE_ITEMS_BY_ID = `
    DELETE FROM items WHERE id = ?
    `
export const UPDATE_ITEM = `
    UPDATE items
    SET bar_code = ?,
        item_name = ?,
        quantity = ?,
        caliber = ?,
        serial_number = ?,
        manufacturer = ?,
        purchase_price = ?,
        selling_price = ?,
        supplier_id = ?,
        product_status = ?,
        product_image = ?,
        included_accessories = ?,
        additional_notes = ?
    WHERE id = ?
  `

/**
 * Query per ottenere un elemento specifico in base all'ID.
 * @param id - ID dell'elemento da recuperare
 * @returns {ItemPayload | null} - Elemento corrispondente o `null`
 */
export const GET_ITEM_BY_ID = `
  SELECT * 
  FROM items 
  WHERE id = ?;
`

export const SEARCH_ITEMS = `
  SELECT *
  FROM items
  WHERE bar_code || item_name LIKE '%' || ? || '%'
`
