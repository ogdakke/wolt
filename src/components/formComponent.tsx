import { Inter, Noto_Sans_Wancho } from '@next/font/google'
import styles from "@/styles/Home.module.css"
import {useForm, SubmitHandler} from 'react-hook-form'
import React, { useState} from 'react'
import * as Label from '@radix-ui/react-label'
import { isFriday, parseISO } from 'date-fns'

const inter = Inter({ subsets: ['latin'] })


const FormComponent: React.FC = () => {
  const [time, setTime] = useState(String)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [inputData, setInputData] = useState([])
  
  const date = new Date()
  
  interface Inputs {
    cartValue: number
    deliveryDistance: number
    numberOfItems: number
    date: string
    time: Date
  }


const calculateDeliveryFee = (data: Inputs) => {
  const SaveData = (data: Inputs) => {
    
  }
  
  // declare fee as a number
  let fee: number = 0;
  const cartValue = data.cartValue
  const deliveryDistance = data.deliveryDistance
  const numberOfItems = data.numberOfItems
  // date from input
  const date = parseISO(data.date)
  // get the current time in hh:mm:ss
  const hours = data.time.toString().split(":")[0]

  console.log(cartValue, "from calculatefunc");
  console.log(deliveryDistance, "from calculatefunc");
  console.log(numberOfItems, "from calculatefunc");
  console.log(isFriday(date));
  console.log(hours, "from asdjkas");
  
  
  // Calculate small order surcharge
  if (cartValue < 10) {
    let surcharge: number = 10 - cartValue
    fee = +cartValue + surcharge
    console.log(fee);   
  }

  // Calculate delivery distance fee
  if (deliveryDistance <= 1000) {
    fee += 2
  } else {
    const additionalDistance = deliveryDistance - 1000
    fee += 2 + Math.ceil(additionalDistance / 500) * 1
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

  // Apply Friday rush fee if 
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

  //  
  const precise = (num: number) => {
    return parseFloat(num.toPrecision(4))
  }
  precise(fee)
    
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

const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>()

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
      type="number"
      step={0.01}

      {...register("cartValue", {required: true, min: 0.01})}/>
      {errors.cartValue && <span>This field is required</span>}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="deliveryDistance">
      Delivery distance in meters
      </Label.Root>
      <input  className={inter.className}
      aria-label='deliveryDistance'
      type="number"
      placeholder='for example: 1203'
      {...register("deliveryDistance", { required: true, min: 1 })} />
      {errors.deliveryDistance && <span>Enter distance of delivery</span>}
    </div>
    {/* errors will return when field validation fails  */}

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="numberOfItems">
      Number of items
      </Label.Root>
      <input className={inter.className}
      aria-label='numberOfItems'
      type="number"
      placeholder='Number of items' 
      {...register("numberOfItems", {valueAsNumber:true, required: true, min: 1})} />
      {watch(errors.numberOfItems) && <span>Input a whole number of items.</span>}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="dateInput">
      Enter Date. Default is today
      </Label.Root>
      <input className={inter.className}
      aria-label='dateInput'
      type="date"    
      defaultValue={dateNow}
      {...register("date", {required: true})} />
      {errors.date && <span>Input a valid date.</span>}
    </div>

    <div className={styles.inputWrapper}>
      <Label.Root className={styles.LabelRoot} htmlFor="timeInput">
        Time of order
        </Label.Root>
      <input className={inter.className}
      aria-label='timeInput'
      type="time"    
      defaultValue={timeNow}
      {...register("time", {required: true})} />
      {errors.time && <span>Input a delivery time.</span>}
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