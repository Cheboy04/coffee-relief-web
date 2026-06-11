import type { ComponentType } from 'react'
import { VolcanicIcon, ProducerIcon, RoastedIcon, ShippingIcon, EcoIcon } from './icons'

export type TrustItem = {
  id: string
  icon: ComponentType<{ className?: string }>
  label: string
}

export const TRUST_ITEMS: TrustItem[] = [
  { id: 'volcanic',  icon: VolcanicIcon,  label: 'Café 100% Volcánico'      },
  { id: 'producer',  icon: ProducerIcon,  label: 'Directo del Productor'     },
  { id: 'roasted',   icon: RoastedIcon,   label: 'Tostado Artesanal'         },
  { id: 'shipping',  icon: ShippingIcon,  label: 'Envío Gratis desde $35'    },
  { id: 'eco',       icon: EcoIcon,       label: 'Empaque Sostenible'        },
]
