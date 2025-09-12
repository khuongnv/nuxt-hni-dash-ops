import { readFileSync, writeFileSync } from 'fs'
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
    
    const menuIndex = menus.findIndex((m: any) => m.id === Number(id))
    
    if (menuIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy menu'
      })
    }
    
    const deletedMenu = menus[menuIndex]
    
    // Remove menu from array
    menus.splice(menuIndex, 1)
    
    // Write back to file
    writeFileSync(filePath, JSON.stringify(menus, null, 2), 'utf-8')
    
    return {
      success: true,
      message: 'Xóa menu hệ thống thành công',
      data: deletedMenu
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi xóa menu hệ thống'
    })
  }
})
