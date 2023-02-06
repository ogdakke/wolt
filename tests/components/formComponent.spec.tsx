import * as React from "react";
import "@testing-library/jest-dom"
import {screen, render, fireEvent, } from '@testing-library/react'
import user from "@testing-library/user-event"

import FormComponent, { calculateDeliveryFee } from "../../src/components/formComponent";

describe('formComponent', () => {
  


  
test('should render form with all the fields.', () => {
  render(<FormComponent />)
  const submitButton = screen.getByLabelText('Calculate')

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

test('Should Calculate correct value for deliveryFee', () => {
  // test for friday rush fee and surcharge fee
  const data = { cartValue: 1,
    date: new Date(2023, 1, 3),
    deliveryDistance: 3,
    numberOfItems: 4,
    time: "18:30"}
  expect(calculateDeliveryFee(data)).toBe(14.4)

  // test for no additional fees other than default deliveryFee
  const data2 = {cartValue: 10, deliveryDistance: 999, numberOfItems: 4, date: new Date(2023, 2, 5), time: "08.00"}
  expect(calculateDeliveryFee(data2)).toBe(2)

  // test for over 100€ cart value
  
  // test for delivery fee never going above 15

  // test for edge cases in delivery distance. for ex. 1000, 1001, 1501, 2499 etc...
  // also negative numbers
  const distances = [1000, 1001, 1499, 1500, 1501, 2999, 4006, 8472, 0, -19, 0.000001]
  // map over the destances to 
  const values = distances.map(distance => calculateDeliveryFee({
    cartValue: 10,
    date: new Date(2023, 2, 4),
    deliveryDistance: distance,
    numberOfItems: 4,
    time: "18:30"
  }))
  
  expect(values).toStrictEqual([2,3,3,3,4,6,9,15,2,2,2])
  })

})


// test('Should submit correct form data', async () => {
//   const CARTVALUE = "10"
//   const DELIVERYDISTANCE = "1499"
//   const NUMBEROFITEMS = "4"
//   const DATEINPUT = "2023-03-22"
//   const TIMEINPUT = "18:30"
//   const FEE = 3.6 
  
//   render(<FormComponent/>)

//   const cartInput = screen.getByLabelText("cartValue")
//     cartInput.textContent = CARTVALUE
//   const deliveryInput = screen.getByLabelText("deliveryDistance")
//     deliveryInput.textContent = DELIVERYDISTANCE
//   const itemsInput = screen.getByLabelText("numberOfItems")
//     itemsInput.textContent = NUMBEROFITEMS
//   const dateInput = screen.getByLabelText("dateInput")
//     user.type(dateInput, DATEINPUT)
//   const timeInput = screen.getByLabelText("timeInput")
//     user.type(timeInput, TIMEINPUT)

//   const submitButton = screen.getByLabelText('Calculate')

//   fireEvent.click(submitButton)
//   expect(await screen.findByLabelText("deliveryFee")).toHaveTextContent(`Delivery fee: ${FEE} €`)
// })

