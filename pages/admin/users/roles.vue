<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <PageHeader title="Phân quyền người dùng" />
    
    <!-- Content -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Quản lý phân quyền</h2>
        <p class="text-muted-foreground">
          Đây là trang test cho menu tầng 2 - Phân quyền (có menu con tầng 3)
        </p>
        <div class="mt-4 p-4 bg-muted/50 rounded-lg">
          <p class="text-sm">
            <strong>Đường dẫn:</strong> /admin/users/roles<br>
            <strong>Cấp độ:</strong> Menu tầng 2 (có children)<br>
            <strong>Mục đích:</strong> Test tính năng menu phân tầng của sidebar
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/PageHeader.vue'
</script>
