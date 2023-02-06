import { Inter, Noto_Sans_Wancho } from '@next/font/google'
import styles from "@/styles/Home.module.css"
import {useForm, SubmitHandler} from 'react-hook-form'
import React, { useState} from 'react'
import * as Label from '@radix-ui/react-label'
import { isFriday, parseISO } from 'date-fns'

const inter = Inter({ subsets: ['latin'] })


const FormComponent: React.FC = () => {
  const [deliveryFee, setDeliveryFee] = useState(0)
  // const [inputData, setInputData] = useState<Inputs>()
  
  const date = new Date()
  
  // declare the types of inputs
  interface Inputs {
    cartValue: number
    deliveryDistance: number
    numberOfItems: number
    date: string
    time: string
  }

/**
 * calculates the delivery fee from user-inputted data
 * @param {Inputs} data User inputted data from the form
 * @returns {number} fee - value of delivery fee
 */
const calculateDeliveryFee = (data: Inputs): number => {
  
  // declare fee as a number
  let fee: number = 0;
  // get the inputs
  const cartValue = data.cartValue
  // Round delivery distance down - This is because while decimal inputs are possible, it makes no sense to handle them as decimals.
  const deliveryDistance = Math.floor(data.deliveryDistance)
  const numberOfItems = data.numberOfItems
  // date from input
  const date = parseISO(data.date)
  // get the inputted hours from hh:mm by splitting before : 
  const hours = data.time.split(":")[0]

  console.log(cartValue, "from calculatefunc");
  console.log(deliveryDistance, "from calculatefunc");
  console.log(numberOfItems, "from calculatefunc");
  console.log("is it friday: ",isFriday(date));
  console.log(hours, "from timeInput", data.time);
  
  
  // Calculate small order surcharge
  if (cartValue < 10) {
    let surcharge: number = 10 - cartValue
    fee = +cartValue + surcharge
    console.log(fee);   
  }

  // add the default delivery cost of 2€
  fee += 2
  // Calculate delivery distance fee
  if (deliveryDistance > 1000) {
    
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
  if (isFridayRush) {
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
  
  console.log(fee);
  
  setDeliveryFee(precise(fee))
  return fee
};

// Here we get the current time and date for the ui on initial load. It gets overriden by the user inputting something else
// Date in yyyy-mm-dd format to match default "date" input format.
const dateNow = date.toISOString().slice(0,10)
// Time in hours and minutes. Since getHours & getMinutes return digits <= 9 as 0, 1, 2 ... and not 00, 01, 02, ... we need to pad with "0" to length 2.
const hours = date.getHours().toString().padStart(2, '0')
const minutes = date.getMinutes().toString().padStart(2, '0')
const timeNow = `${hours}:${minutes}`


const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
  defaultValues: {
    date: dateNow,
    time: timeNow
  },
  mode: "onChange"
})

// On submit, call the calculateDeliveryFee function.
const onSubmit: SubmitHandler<Inputs> = (data: Inputs) =>{
  calculateDeliveryFee(data)

} 
return (
  <>
  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot}  htmlFor="cartValue">
      Cart Value
      </Label.Root>
      <input  className={inter.className}
      aria-label='cartValue'
      placeholder='eg. 10.50'
      type="tel"
      step={0.01}

      {...register("cartValue", 
        {valueAsNumber:true, required: true, min: 0.01, validate: (value) => value >= 0.01})
      }/>
      {errors.cartValue && <span>Input valid cart value</span>}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="deliveryDistance">
      Delivery distance in meters
      </Label.Root>
      <input  className={inter.className}
      aria-label='deliveryDistance'
      type="tel"
      step={1}
      placeholder='for example: 1203'
      {...register("deliveryDistance", 
        {valueAsNumber: true, required: true, min: 1, validate: (value) => value > 0})
      } />
      {errors.deliveryDistance && <span>Enter distance of delivery</span>}
    </div>
    {/* errors will return when field validation fails  */}

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
      {errors.numberOfItems && <span>Input a whole number of items</span>}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="dateInput">
      Enter Date. Default is today
      </Label.Root>
      <input className={inter.className}
      aria-label='dateInput'
      type="date"    
      // defaultValue={dateNow}
      {...register("date", {valueAsDate: true, required: true})} />
      {errors.date && <span>Input a valid date</span>}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="timeInput">
        Time of order
        </Label.Root>
      <input className={inter.className}
      aria-label='timeInput'
      type="time"    
      // defaultValue={timeNow}
      {...register("time", {required: true})} />
      {errors.time && <span>Input a valid delivery time</span>}
    </div>
    
    <button className={styles.inputButton} type="submit" value={"Calculate delivery costs"}>
      Calculate
    </button>
  </form> 
  <div className={styles.result}>
    <h2 aria-label='deliveryFee' >Delivery fee: {deliveryFee} €</h2>
  </div>
  </>
  )
}
export default FormComponent