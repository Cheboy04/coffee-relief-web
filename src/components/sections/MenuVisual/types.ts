export type MenuItemTag = 'signature' | 'vegano' | 'sin-gluten'

export interface MenuCategory {
  id: string
  label: string
  eyebrow: string
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: string
  image?: string
  imageAlt: string
  placeholderColor: string
  tag?: MenuItemTag
}
