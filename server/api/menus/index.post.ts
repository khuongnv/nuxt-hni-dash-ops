import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
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
    
    // Generate new ID
    const newId = Math.max(...menus.map((m: any) => m.id), 0) + 1
    
    const newMenu = {
      id: newId,
      name: body.name.trim(),
      href: body.href.trim(),
      icon: body.icon.trim(),
      order: body.order || newId,
      isActive: body.isActive !== undefined ? body.isActive : true,
      parentId: body.parentId || null,
      level: body.level || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    menus.push(newMenu)
    
    // Write back to file
    writeFileSync(filePath, JSON.stringify(menus, null, 2), 'utf-8')
    
    return {
      success: true,
      message: 'Thêm menu hệ thống thành công',
      data: newMenu
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi thêm menu hệ thống mới'
    })
  }
})
