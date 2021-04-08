import React, { useRef, useState, useMemo, forwardRef, useImperativeHandle, ChangeEvent, KeyboardEvent, ForwardedRef } from 'react'
import numeral from 'numeral'

import { InputProps, ClipboardEvent } from '../'

const regex = /^[0-9,.]+/g
const keyRegex = /^(Backspace)|((Numpad|Digit)[0-9]{1})/i

const setCaretPosition = (inputForm: HTMLInputElement, index: number) => {
  inputForm.setSelectionRange(index, index, 'none')
}

const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement> | null) => {
  const inputRef = useRef<HTMLInputElement>(null)
  let clockTimeout: any = 0

  // merge forwarded ref and input ref selector
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  useImperativeHandle(ref, () => inputRef?.current!)

  const { format = '0', onChange, ...rest } = props

  let { min = 0, max } = props
  min = numeral(min).value() || 0
  max = numeral(max).value() || undefined

  const defaultValue = props.defaultValue ? numeral(props.defaultValue).format(format) : ''

  const [state, setState] = useState<{
    value: string
    position: number
  }>({
    value: defaultValue,
    position: 0,
  })

  const [changeEvent, setChangeEvent] = useState<ChangeEvent<HTMLInputElement>>()

  const focusOnChar = (value: string, index: number) => {
    const val = numeral(value).value()

    const dotCount = (value.match(/\./g) || []).length
    let finalIndex = (val || 0).toString().length

    finalIndex = index + dotCount

    if (!finalIndex) finalIndex = 1

    return finalIndex
  }

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist()

    let m: RegExpExecArray | null
    let { value } = event.target
    let position = regex.lastIndex

    const numeralValue = numeral(value).value() || 0
    let unformattedValue = numeralValue.toString()

    if (max && max < numeralValue) {
      unformattedValue = unformattedValue.slice(0, -1)
    }

    while ((m = regex.exec(unformattedValue)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++
      }

      position = regex.lastIndex
    }

    value = value === '' ? '' : numeral(parseFloat(unformattedValue)).format(format) || ''
    position = focusOnChar(value, position)

    new Promise((resolve) => {
      setState({
        value,
        position,
      })
      resolve(true)
    }).then(() => {
      setCaretPosition(inputRef.current!, position)
    })

    if (clockTimeout !== 0) clearTimeout(clockTimeout)
    setChangeEvent(event)

    // set a new clock ( timeout )
    clockTimeout = setTimeout(() => null, 300)
  }

  const onPropsOnChange = () => {
    if (clockTimeout !== 0) clearTimeout(clockTimeout)

    // set a new clock ( timeout )
    clockTimeout = setTimeout(() => {
      // parentNode onChange function
      if (changeEvent) {
        const numeralValue = numeral(state.value).value()

        if (min && min > numeralValue) {
          changeEvent.target.setCustomValidity(`The given value must be greater than ${min}`)
        }

        if (onChange) {
          const tempValue = (numeralValue || '').toString()
          const value = parseFloat(tempValue) || 0

          onChange(changeEvent, value)
        }
      }
    }, 1000)
  }

  const keyboardHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ',') {
      const parts = state.value.split(',')
      const position = parts[0]?.length + 1 || 0
      setCaretPosition(inputRef.current!, position)

      return event.preventDefault()
    }

    if (keyRegex.test(event.code)) onPropsOnChange()
  }

  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Backspace' || event.code === 'Delete') {
      const lastIndex = inputRef!.current?.selectionEnd || 0

      if (lastIndex > 0) {
        const lastChar = state.value.slice(lastIndex - 1, lastIndex)

        if (lastChar === ',') {
          setCaretPosition(inputRef.current!, lastIndex - 1)
          return event.preventDefault()
        }
      }
    }
  }

  const clipboardHandler = (event: ClipboardEvent<HTMLInputElement>) => {
    onPropsOnChange()
  }

  useMemo(() => {
    const { value } = props

    if (value !== undefined && value !== null) {
      setState({ value: value.toString(), position: value?.toString().length || 0 })
    }
  }, [props.value])

  return (
    <input
      ref={inputRef}
      {...rest}
      type="tel"
      onChange={changeHandler}
      onKeyUp={keyboardHandler}
      onKeyDown={keyDownHandler}
      onKeyPress={keyboardHandler}
      onPaste={clipboardHandler}
      value={state.value}
      autoComplete="off"
    />
  )
})

Input.displayName = 'NumeralReact'

export default Input
