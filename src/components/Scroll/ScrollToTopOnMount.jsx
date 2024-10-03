import {useEffect} from 'react'
import { animateScroll as scroll } from 'react-scroll';

export const ScrollToTopOnMount = () => {
    useEffect(() => {
        scroll.scrollToTop();
      }, []);
      return null;
}

// import { useEffect } from 'react';
// import { animateScroll as scroll } from 'react-scroll';
// export const ScrollToTopOnMount = ({onScrollComplete }) => {
  
//   useEffect(() => {
//     window.scrollTo(0, 0);
//     if (onScrollComplete) {
//       scroll.scrollToTop();
//       onScrollComplete();
//     }
//   }, [onScrollComplete]);

//   return null; 
// }

