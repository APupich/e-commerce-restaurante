import React from 'react'
import s from "./Footer.module.css"

export default function Footer() {
    return (
        <>
            <footer className={s.footer}>
                <div className={s.marco}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="16" viewBox="0 0 320 16" class="mcd-svg-drops-mobile is-hidden-desktop"><g fill="none" fill-rule="evenodd"><g fill="#FFBC0D"><g><path d="M241 0h2.673c8.214.335 12.377 8.872 21.064 7.531 3.134-.483 5.743-2.316 9.017-2.343 7.835-.063 11.681 8.966 18.99 10.531 2.192.47 4.494.408 6.522-.623 1.779-.903 3.16-2.399 4.358-3.963 2.07-2.705 3.912-5.636 6.386-8.004 1.346-1.286 2.97-2.481 4.815-2.874.716-.153 1.44-.217 2.165-.255H320M0 0c28.903 0 37.863 13 50.87 13C66.478 13 76.304 0 98.56 0c16.258 0 21.298 7.313 28.614 7.313C135.954 7.313 141.482 0 154 0" transform="translate(0 -198) translate(0 198)"></path></g></g></g></svg>
                </div>
                
            </footer>
        </>
    )
}
