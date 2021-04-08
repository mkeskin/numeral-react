import { RefObject, SyntheticEvent, ChangeEvent, ClipboardEvent as ReactClipboardEvent, InputHTMLAttributes } from 'react'

type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E, value: number | null): void }['bivarianceHack']
type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>

export interface ClipboardEvent<T> extends ReactClipboardEvent<T> {
  key?: string | undefined
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  format?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  ref?: RefObject<HTMLInputElement>
}
