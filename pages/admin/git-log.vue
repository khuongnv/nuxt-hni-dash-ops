<template>
  <div class="space-y-4">
    <PageHeader 
      title="Git Log" 
      description="Xem lịch sử các lần commit và push code"
    />
    
    <Card class="-mt-2">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <GitBranch class="h-5 w-5" />
          Lịch sử Git
        </CardTitle>
        <CardDescription>
          Hiển thị thông tin về các lần commit, push và trạng thái repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span class="ml-2 text-muted-foreground">Đang tải git log...</span>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="p-4 border border-red-200 rounded-lg bg-red-50">
          <h3 class="text-red-800 font-medium">Lỗi khi tải git log</h3>
          <p class="text-red-600 text-sm mt-1">{{ error }}</p>
          <Button @click="loadGitLog" variant="outline" size="sm" class="mt-2">
            Thử lại
          </Button>
        </div>
        
        <!-- Git log content -->
        <div v-else-if="gitData" class="space-y-6">
          <!-- Repository info -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium text-sm text-muted-foreground mb-1">Branch hiện tại</h4>
              <p class="text-lg font-semibold">{{ gitData.currentBranch }}</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium text-sm text-muted-foreground mb-1">Remote branches</h4>
              <p class="text-lg font-semibold">{{ gitData.remoteBranches.length }}</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium text-sm text-muted-foreground mb-1">Commits gần đây</h4>
              <p class="text-lg font-semibold">{{ gitData.commits.length }}</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium text-sm text-muted-foreground mb-1">Nguồn dữ liệu</h4>
              <Badge 
                :variant="gitData.source === 'local' ? 'default' : gitData.source === 'github' ? 'secondary' : 'destructive'"
                class="text-xs"
              >
                {{ getSourceLabel(gitData.source) }}
              </Badge>
            </div>
          </div>
          
          <!-- Source info -->
          <div v-if="gitData.source === 'github'" class="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div class="flex items-center gap-2">
              <GitBranch class="h-5 w-5 text-blue-600" />
              <h3 class="text-blue-800 font-medium">Dữ liệu từ GitHub API</h3>
            </div>
            <p class="text-blue-600 text-sm mt-1">
              Đang hiển thị dữ liệu từ GitHub repository (production mode)
            </p>
          </div>
          
          <div v-else-if="gitData.source === 'fallback'" class="p-4 border border-red-200 rounded-lg bg-red-50">
            <div class="flex items-center gap-2">
              <AlertTriangle class="h-5 w-5 text-red-600" />
              <h3 class="text-red-800 font-medium">Dữ liệu fallback</h3>
            </div>
            <p class="text-red-600 text-sm mt-1">
              Không thể truy cập GitHub API, hiển thị dữ liệu mặc định
            </p>
          </div>
          
          <!-- Unpushed commits warning -->
          <div v-if="gitData.lastPush" class="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div class="flex items-center gap-2">
              <AlertTriangle class="h-5 w-5 text-yellow-600" />
              <h3 class="text-yellow-800 font-medium">Có {{ gitData.lastPush.unpushed }} commit chưa push</h3>
            </div>
            <p class="text-yellow-600 text-sm mt-1">
              Các commit này chưa được đẩy lên remote repository
            </p>
          </div>
          
          <!-- Commits list -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Commits gần đây</h3>
            <div class="space-y-2">
              <div 
                v-for="commit in gitData.commits" 
                :key="commit.hash"
                class="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <Badge variant="outline" class="font-mono text-xs">
                        {{ getCommitHashShort(commit.hash) }}
                      </Badge>
                      <span class="text-sm text-muted-foreground">
                        {{ commit.author }}
                      </span>
                    </div>
                    <h4 class="font-medium text-sm mb-1">
                      {{ getCommitMessagePreview(commit.message, 80) }}
                    </h4>
                    <p class="text-xs text-muted-foreground">
                      {{ formatDate(commit.date) }}
                    </p>
                  </div>
                  <div class="flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      @click="copyCommitHash(commit.hash)"
                      class="h-8 w-8 p-0"
                    >
                      <Copy class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Raw git log -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Raw Git Log</h3>
            <div class="p-4 bg-muted rounded-lg">
              <pre class="text-sm font-mono whitespace-pre-wrap overflow-x-auto">{{ gitData.rawLog }}</pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GitBranch, AlertTriangle, Copy } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Badge from '~/components/ui/Badge.vue'
import PageHeader from '~/components/PageHeader.vue'
import { useGitLog, type GitLogData } from '~/composables/useGitLog'

// Page meta
definePageMeta({
  layout: 'default'
})

// Composables
const { getGitLog, formatDate, getCommitHashShort, getCommitMessagePreview } = useGitLog()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const gitData = ref<GitLogData | null>(null)

// Methods
const loadGitLog = async () => {
  loading.value = true
  error.value = null
  
  try {
    gitData.value = await getGitLog()
  } catch (err: any) {
    error.value = err.message || 'Có lỗi xảy ra khi tải git log'
  } finally {
    loading.value = false
  }
}

const copyCommitHash = async (hash: string) => {
  try {
    await navigator.clipboard.writeText(hash)
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy commit hash:', err)
  }
}

const getSourceLabel = (source: string): string => {
  switch (source) {
    case 'local':
      return 'Local Git'
    case 'github':
      return 'GitHub API'
    case 'fallback':
      return 'Fallback'
    default:
      return 'Unknown'
  }
}

// Lifecycle
onMounted(() => {
  loadGitLog()
})
</script>
