import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID không hợp lệ'
      })
    }

    // Validate required fields
    if (!body.name || !body.href || !body.icon) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc: name, href, icon'
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
    
    // Update menu
    menus[menuIndex] = {
      ...menus[menuIndex],
      name: body.name.trim(),
      href: body.href.trim(),
      icon: body.icon.trim(),
      order: body.order || menus[menuIndex].order,
      isActive: body.isActive !== undefined ? body.isActive : menus[menuIndex].isActive,
      parentId: body.parentId !== undefined ? body.parentId : menus[menuIndex].parentId,
      level: body.level || menus[menuIndex].level,
      updatedAt: new Date().toISOString()
    }
    
    // Write back to file
    writeFileSync(filePath, JSON.stringify(menus, null, 2), 'utf-8')
    
    return {
      success: true,
      message: 'Cập nhật menu hệ thống thành công',
      data: menus[menuIndex]
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi cập nhật menu hệ thống'
    })
  }
})
