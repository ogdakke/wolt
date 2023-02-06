import "@testing-library/jest-dom"
import {screen, render } from "@testing-library/react";

import Description from "../../src/components/description";

describe('description', () => {
  test('should render the component', async () => {
    render(<Description />)
    // find the link
    expect(
      await screen.findByTitle("Opens in a new tab")
    ).toBeVisible()
    // find the whole document
    expect(
      await screen.findByLabelText("description")
    ).toBeInTheDocument()
  })
})
