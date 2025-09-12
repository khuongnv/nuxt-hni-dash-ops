import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const filePath = join(process.cwd(), 'server/data/menus.json')
    const data = readFileSync(filePath, 'utf-8')
    const menus = JSON.parse(data)
    
    return {
      success: true,
      data: menus
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi đọc dữ liệu menu'
    })
  }
})
