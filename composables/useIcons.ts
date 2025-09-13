import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  Info,
  Plus,
  Shield,
  Lock,
  Key,
  User,
  FileText,
  Home,
  Search,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Share,
  Copy,
  Link,
  ExternalLink,
  Database,
  Server,
  Cloud
} from 'lucide-vue-next'

// Icon mapping - tập trung quản lý tất cả icons
export const iconMap = {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
  Info,
  Plus,
  Shield,
  Lock,
  Key,
  User,
  FileText,
  Home,
  Search,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Share,
  Copy,
  Link,
  ExternalLink,
  Database,
  Server,
  Cloud
}

// Available icons list - danh sách tên icons có thể sử dụng
export const availableIcons = [
  'LayoutDashboard', 'Users', 'BarChart3', 'Settings', 'Menu', 'Info',
  'Shield', 'Lock', 'Key', 'FileText', 'Home', 'Search', 'Bell', 'User',
  'Mail', 'Phone', 'Calendar', 'Clock', 'Star', 'Heart', 'ThumbsUp',
  'MessageSquare', 'Image', 'Video', 'Music', 'Download', 'Upload',
  'Share', 'Copy', 'Link', 'ExternalLink', 'Database', 'Server', 'Cloud'
]

// Composable để sử dụng icons
export const useIcons = () => {
  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Menu
  }

  // Check if icon exists
  const hasIcon = (iconName: string) => {
    return iconName in iconMap
  }

  // Get all available icon names
  const getAllIconNames = () => {
    return availableIcons
  }

  return {
    iconMap,
    availableIcons,
    getIconComponent,
    hasIcon,
    getAllIconNames
  }
}
