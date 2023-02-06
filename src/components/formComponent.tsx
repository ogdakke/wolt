import React, { useState, useEffect} from 'react'

import { Inter} from '@next/font/google'
import styles from "@/styles/Home.module.css"
import * as Label from '@radix-ui/react-label'

import { isFriday} from 'date-fns'
import {useForm, SubmitHandler} from 'react-hook-form'

const inter = Inter({ subsets: ['latin'] })
// declare the types of inputs
export interface Inputs {
  cartValue: number
  deliveryDistance: number
  numberOfItems: number
  date: Date
  time: string
}


const FormComponent: React.FC = () => {

// set the state for the fee and submitted for conditional rendering
const [deliveryFee, setDeliveryFee] = useState(0)
const [submitted, setSubmitted] = useState(false)


// Here we get the current time and date for the ui on initial load. It gets overriden by the user inputting something else
const date = new Date()
// Date in yyyy-mm-dd format to match default "date" input format.
const dateNow = date.toISOString().slice(0,10)

// Time in hours and minutes. Since getHours & getMinutes return digits <= 9 as 0, 1, 2 ... and not 00, 01, 02, ... we need to pad with "0" to length 2.
const hours = date.getHours().toString().padStart(2, '0')
const minutes = date.getMinutes().toString().padStart(2, '0')
const timeNow = `${hours}:${minutes}`


// register to get get values from form, formstate to handle errors, and handleSubmit to handle submitting
const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>({
  // set the default value of time to be timeNow. 
  defaultValues: {
      time: timeNow
  },
  mode: "onChange"
})




// On submit, call the calculateDeliveryFee function.
const onSubmit: SubmitHandler<Inputs> = (data: Inputs) =>{
  setSubmitted(true)
  console.log("submitted", submitted);
  
  setDeliveryFee(calculateDeliveryFee(data))

} 
return (
  <>
  {/* The main form element, which when submitted will call handlesubmit */}
  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot}  htmlFor="cartValue">
      Cart Value
      </Label.Root>
      <input  className={inter.className}
      aria-label='cartValue'
      placeholder='eg. 10.50'
      // use "number", to allow decimals
      type="number"
      step={0.01}
      // register each form input element and validate them.
      {...register("cartValue", 
        {valueAsNumber:true, required: true, min: 0.01, validate: (value) => value >= 0.01})
      }/>
    {/* errors will return true when field validation fails  */}
      {errors.cartValue ? <span>Input valid cart value</span> : null}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="deliveryDistance">
      Delivery distance in meters
      </Label.Root>
      <input  className={inter.className}
      aria-label='deliveryDistance'
      // use "tel" to get numpad on mobile
      type="tel"
      placeholder='for example: 1203'
      {...register("deliveryDistance", 
        {valueAsNumber: true, required: true, min: 1, validate: (value) => value > 0})
      } />
      {errors.deliveryDistance ? <span>Enter distance of delivery</span> : null}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="numberOfItems">
      Number of items
      </Label.Root>
      <input className={inter.className}
      aria-label='numberOfItems'
      type="tel"
      placeholder='Number of items' 
      {...register("numberOfItems", 
        {valueAsNumber:true, required: true, min: 1, validate: (value) => value >= 1})
      } />
      {errors.numberOfItems ? <span>Input a whole number of items</span> : null}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="dateInput">
      Enter Date. Default is today
      </Label.Root>
      <input className={inter.className}
      defaultValue={dateNow}
      aria-label='dateInput'
      type="date"    
      {...register("date", {valueAsDate: true, required: true})} />
      {errors.date ? <span>Input a valid date</span> : null}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="timeInput">
        Time of order
        </Label.Root>
      <input className={inter.className}
      aria-label='timeInput'
      type="time"    
      {...register("time", {required: true})} />
      {errors.time ? <span>Input a valid delivery time</span> : null}
    </div>
    
    <div className={styles.buttonWrapper}> 
      <button aria-label='Calculate' className={styles.inputButton} 
      type="submit">
        Calculate
      </button>
      <button
        aria-label='Reset Values'
        className={styles.inputButton}
        type='button'
        onClick={() => {
          reset()
          setSubmitted(false)
          }}>
        Reset
      </button>
    </div>

    <div className={styles.resultWrapper}>
    <p className={styles.result}>Result:</p>
    <div className={styles.card}>
      {submitted ? 
      <h2 className={styles.submitted} aria-label='deliveryFee' >Delivery fee: <span>{deliveryFee}</span> €</h2>
      : <h2 className={styles.unsubmitted} aria-label='deliveryFee' >
        Delivery fee: <span>{deliveryFee}</span> €
        </h2>}
    </div>
    </div>
  </form> 
  </>
  )
}

/**
 * calculates the delivery fee from user-inputted data
 * @param {Inputs} data User inputted data from the form
 * @returns {number} fee - value of delivery fee
 */
export const calculateDeliveryFee = (data: Inputs): number => {
  
  // declare fee as a number
  let fee: number = 0;
  // get the inputs
  const cartValue = data.cartValue
  if (cartValue < 0.01 || Number.isNaN(cartValue)) {
    fee = 0
  } 

  // Round delivery distance down - This is because while decimal inputs are possible, it makes no sense to handle them as decimals.
  let deliveryDistance = Math.floor(data.deliveryDistance)
  /**
   * checks if number is NaN or 0 or smaller
   * @param deliveryDistance 
   * @returns {number} deliveryDistance
   */ 
  const checkIfNegative = (deliveryDistance: number): number => {
    if (deliveryDistance <= 0 || Number.isNaN(deliveryDistance)) {
      return deliveryDistance = 1
    }     
    return deliveryDistance
  }
  checkIfNegative(deliveryDistance)
  
  const numberOfItems = data.numberOfItems
  
  // date from user input
  const date = data.date

  // get the user inputted hours from hh:mm by splitting before : 
  const hours = data.time.split(":")[0]

  // console.log(cartValue, "from calculatefunc");
  // console.log(deliveryDistance, "from calculatefunc");
  // console.log(numberOfItems, "from calculatefunc");
  // console.log("is it friday: ",data.date ,isFriday(data.date));
  // console.log(date, data.date);
  // console.log(hours, "from timeInput", data.time);
  
  
  // Calculate small order surcharge
  if (cartValue < 10) {
    let surcharge: number = 10 - cartValue
    fee = +cartValue + surcharge
  }

  // add the default delivery cost of 2€
  fee += 2
  // Calculate delivery distance fee
  if (deliveryDistance > 1000) {
    const additionalDistance = (deliveryDistance - 1000)
    
    let quotient = ~~(additionalDistance / 500)
    fee += quotient
    
    if ((additionalDistance/500 != 0) && additionalDistance % 500 > 0 && additionalDistance % 500 < 500) {
      fee += 1
    }
  } 

  // Calculate item surcharge
  if (numberOfItems >= 5) {
    const itemSurcharge = (numberOfItems - 4) * 0.5
    fee += itemSurcharge
  }

  // Apply bulk fee
  if (numberOfItems > 12) {
    fee += 1.2
  }

  // Apply Friday rush fee if time is between 15:00 and 19:00
  const isFridayRush = parseInt(hours) >= 15 && parseInt(hours) < 19
  if (isFridayRush && isFriday(date)) {
    fee *= 1.2
  }

  // Ensure fee does not exceed 15€
  fee = Math.min(fee, 15)

  // Delivery is free if cart value is 100€ or more
  if (cartValue >= 100) {
    fee = 0
  }

  //  precision function to make it return in format xx.xx
  const precise = (num: number) => {
    return parseFloat(num.toPrecision(4))
  }
  
  return precise(fee)
}

export default FormComponent 