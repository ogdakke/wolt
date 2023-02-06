import React from "react"
import styles from "@/styles/Home.module.css"

const description: React.FC = () => {
  return (
    <>
      <div className={styles.description}>
        <p>
        <h2>
          Hi there,
        </h2>
        This is my submission for the 2023 Wolt internship pre-assignment.
        This app is built using Next.js, and uses plain old css for styling.
        </p>
        <p>
          Thanks for checking this out, and while you are here, visit my website:
          <div className={styles.imageWrapper}>
          <a title="Opens in a new tab" href="https://deweloper.fi" target="_blank" rel="noreferrer">
          <img src="/favicon.svg" alt="" width={20} />
            deweloper.fi</a> 
          </div>
        </p>
      </div>
    </>
  )
}
export default description