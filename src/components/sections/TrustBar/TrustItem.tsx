import type { TrustItem } from './data'

type Props = { item: TrustItem; instanceKey: string }

export default function TrustItem({ item, instanceKey }: Props) {
  const { icon: Icon, label } = item
  return (
    <li
      key={instanceKey}
      className="flex shrink-0 items-center gap-x-3"
    >
      <Icon className="text-secondary size-[18px]" />
      <span className="text-label-md uppercase text-on-surface-variant whitespace-nowrap">
        {label}
      </span>
    </li>
  )
}
