import { render } from "@testing-library/react"
import React from "react"

import Home from '../../src/pages/index'

describe('Renders the page', () => {
  test('Should render the home', () => {
    render(<main/>)
  })
})