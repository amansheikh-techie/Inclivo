import {
  Accessibility,
  Bath,
  Bot,
  Captions,
  FileText,
  Flag,
  Home,
  Info,
  MapPin,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  labelKey: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: Home },
  { to: '/places', labelKey: 'nav.places', icon: MapPin },
  { to: '/washrooms', labelKey: 'nav.washrooms', icon: Bath },
  { to: '/assistant', labelKey: 'nav.assistant', icon: Bot },
  { to: '/captions', labelKey: 'nav.captions', icon: Captions },
  { to: '/schemes', labelKey: 'nav.schemes', icon: FileText },
  { to: '/report', labelKey: 'nav.report', icon: Flag },
  { to: '/passport', labelKey: 'nav.passport', icon: Accessibility },
  { to: '/about', labelKey: 'nav.about', icon: Info },
]

