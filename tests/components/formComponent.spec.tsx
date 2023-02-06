import "@testing-library/jest-dom"
import {screen, render} from '@testing-library/react'
import user from "@testing-library/user-event"

import FormComponent, { calculateDeliveryFee } from "../../src/components/formComponent";

describe('formComponent', () => {
    
test('should render form with all the fields.', async () => {
  render(<FormComponent />)

  expect(
    await screen.findByLabelText("cartValue")
  ).toBeVisible()
  expect(
    await screen.findByLabelText("deliveryDistance")
  ).toBeVisible()
  expect(
    await screen.findByLabelText("numberOfItems")
  ).toBeVisible()
  expect(
    await screen.findByLabelText("dateInput")
  ).toBeVisible()
  expect(
    await screen.findByLabelText("timeInput")
  ).toBeVisible()
  expect(
    await screen.findByLabelText('Calculate')
  ).toBeVisible()
  expect(
    await screen.findByLabelText('Reset Values')
  ).toBeVisible()
  
})

test('Should Calculate correct value for friday Rush', () => {
  // test for friday rush fee and surcharge fee
  const friday = {
    cartValue: 1,
    date: new Date(2023, 1, 3),
    deliveryDistance: 3,
    numberOfItems: 4,
    time: "18:30"
  }
  expect(
    calculateDeliveryFee(friday)
  ).toStrictEqual<number>(14.4)  
})

test('should not apply any fees other than default', () => {  
  // test for no additional fees other than default deliveryFee
  const feeTest = {
  cartValue: 10, 
  deliveryDistance: 999, 
  numberOfItems: 4, 
  date: new Date(2023, 2, 5), 
  time: "08.00"}
  expect(
  calculateDeliveryFee(feeTest)
  ).toStrictEqual<number>(2)
})

test('Delivery Fee should be 0 for orders over 100 €', () => { 
  // test for over 100€ cart value
  const largeAmount = {
    cartValue: 123,
    date: new Date(2023, 2, 4),
    deliveryDistance: 1000,
    numberOfItems: 4,
    time: "18:30"
  }
  expect(
    calculateDeliveryFee(largeAmount)
  ).toStrictEqual<number>(0)
  
 })


test('Delivery fee should never surpass 15', () => {
  // test for delivery fee never going above 15
  const overFifteen = {
    cartValue: 10,
    date: new Date(2009, 6, 27),
    deliveryDistance: 10000,
    numberOfItems: 40,
    time: "11:31"
  }
  expect(
    calculateDeliveryFee(overFifteen)
  ).toStrictEqual<number>(15)

})


test('Edge cases in deliveryDistance', () => {
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
  
    expect(values).toStrictEqual<Array<number>>([2,3,3,3,4,6,9,15,2,2,2])
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

