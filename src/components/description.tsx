import React from "react"
import styles from "@/styles/Home.module.css"
import Image from "next/image"
const description: React.FC = () => {
  return (
    <>
      <div className={styles.description}>
        <h2>
          Hi there,
        </h2>
        <p>
        This is my submission for the 2023 Wolt internship pre-assignment.
        This app is built using Next.js, and uses plain old css for styling.
        </p>
        <p>
          Thanks for checking this out, and while you are here, visit my website:
        </p>
          <div className={styles.imageWrapper}>
          <Image src="/favicon.svg" alt="" width={20} height={20} 
          />
          <a title="Opens in a new tab" href="https://deweloper.fi" target="_blank" rel="noreferrer">
            deweloper.fi</a> 
          </div>
      </div>
    </>
  )
}
export default description