import React from 'react'
import { create, act } from 'react-test-renderer'
import { expect } from 'chai'

import Input from './input'

describe('Options tests', () => {
  let input: any

  beforeEach(() => {
    input = create(<Input />)
  })

  it('should render', function () {
    const { props } = input.toJSON()
    expect(props.type).to.equal('tel')
  })
})
