import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID không hợp lệ'
      })
    }

    const filePath = join(process.cwd(), 'server/data/menus.json')
    const data = readFileSync(filePath, 'utf-8')
    const menus = JSON.parse(data)
    
    const menu = menus.find((m: any) => m.id === Number(id))
    
    if (!menu) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy menu'
      })
    }
    
    return {
      success: true,
      data: menu
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi lấy thông tin menu'
    })
  }
})
