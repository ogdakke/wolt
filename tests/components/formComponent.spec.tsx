import * as React from "react";
import "@testing-library/jest-dom"
import {screen, render, fireEvent, } from '@testing-library/react'
import user from "@testing-library/user-event"

import FormComponent from "../../src/components/formComponent";

describe('formComponent', () => {
  const data = {
    cartValue: "1",
    date: "2024-03-22",
    deliveryDistance: "3",
    numberOfItems: "4",
    time: "18:30"
  }


  
test('should render form with all the fields.', () => {
  render(<FormComponent />)
  const submitButton = screen.getByDisplayValue('Calculate delivery costs')

  expect(
    screen.getByLabelText("cartValue")
  ).toBeInTheDocument()
  expect(
    screen.getByLabelText("deliveryDistance")
  ).toBeInTheDocument()
  expect(
    screen.getByLabelText("numberOfItems")
  ).toBeInTheDocument()
  expect(
    screen.getByLabelText("dateInput")
  ).toBeInTheDocument()
  expect(
    screen.getByLabelText("timeInput")
  ).toBeInTheDocument()
  expect(
    submitButton
  ).toBeInTheDocument()
  
})

test('Should submit correct form data', async () => {
  const CARTVALUE = "10"
  const DELIVERYDISTANCE = "1499"
  const NUMBEROFITEMS = "4"
  const DATEINPUT = "2023-03-22"
  const TIMEINPUT = "18:30"
  const FEE = 3.6 
  
  render(<FormComponent/>)

  const cartInput = screen.getByLabelText("cartValue")
    cartInput.textContent = CARTVALUE
  const deliveryInput = screen.getByLabelText("deliveryDistance")
    deliveryInput.textContent = DELIVERYDISTANCE
  const itemsInput = screen.getByLabelText("numberOfItems")
    itemsInput.textContent = NUMBEROFITEMS
  const dateInput = screen.getByLabelText("dateInput")
    user.type(dateInput, DATEINPUT)
  const timeInput = screen.getByLabelText("timeInput")
    user.type(timeInput, TIMEINPUT)

  const submitButton = screen.getByDisplayValue('Calculate delivery costs')

  fireEvent.click(submitButton)
  expect(await screen.findByLabelText("deliveryFee")).toHaveTextContent(`Delivery fee: ${FEE} €`)
})

})