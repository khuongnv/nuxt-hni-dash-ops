export const useSystemNotifications = () => {
  const { handleAsyncError } = useErrorHandler()

  // Lấy tất cả thông báo
  const getNotifications = async () => {
    return await handleAsyncError(
      async () => {
        const response = await $fetch('/api/system-notifications')
        if (response.success) {
          return response.data || []
        }
        return []
      },
      'getNotifications'
    )
  }

  // Lấy thông báo theo ID
  const getNotificationById = async (id: number) => {
    return await handleAsyncError(
      async () => {
        const response = await $fetch(`/api/system-notifications/${id}`)
        if (response.success) {
          return response.data
        }
        return null
      },
      'getNotificationById'
    )
  }

  // Tạo thông báo mới
  const createNotification = async (notificationData: any) => {
    return await handleAsyncError(
      async () => {
        const response = await $fetch('/api/system-notifications', {
          method: 'POST',
          body: notificationData
        })
        if (response.success) {
          return response.data
        }
        return null
      },
      'createNotification'
    )
  }

  // Cập nhật thông báo
  const updateNotification = async (id: number, notificationData: any) => {
    return await handleAsyncError(
      async () => {
        const response = await $fetch(`/api/system-notifications/${id}`, {
          method: 'PUT',
          body: notificationData
        })
        if (response.success) {
          return response.data
        }
        return null
      },
      'updateNotification'
    )
  }

  // Xóa thông báo
  const deleteNotification = async (id: number) => {
    return await handleAsyncError(
      async () => {
        const response = await $fetch(`/api/system-notifications/${id}`, {
          method: 'DELETE'
        })
        return response.success
      },
      'deleteNotification'
    )
  }

  // Đánh dấu đã đọc
  const markAsRead = async (id: number) => {
    return await handleAsyncError(
      async () => {
        const response = await $fetch(`/api/system-notifications/${id}`, {
          method: 'PUT',
          body: { is_read: true }
        })
        return response.success
      },
      'markAsRead'
    )
  }

  // Lấy thông báo chưa đọc
  const getUnreadNotifications = async () => {
    return await handleAsyncError(
      async () => {
        const notifications = await getNotifications()
        return notifications.filter((notification: any) => !notification.is_read)
      },
      'getUnreadNotifications'
    )
  }

  // Lấy thông báo theo loại
  const getNotificationsByType = async (type: string) => {
    return await handleAsyncError(
      async () => {
        const notifications = await getNotifications()
        return notifications.filter((notification: any) => notification.type === type)
      },
      'getNotificationsByType'
    )
  }

  // Lấy thông báo theo độ ưu tiên
  const getNotificationsByPriority = async (priority: string) => {
    return await handleAsyncError(
      async () => {
        const notifications = await getNotifications()
        return notifications.filter((notification: any) => notification.priority === priority)
      },
      'getNotificationsByPriority'
    )
  }

  return {
    getNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    markAsRead,
    getUnreadNotifications,
    getNotificationsByType,
    getNotificationsByPriority
  }
}
