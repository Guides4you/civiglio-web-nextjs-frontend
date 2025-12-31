import { useEffect } from 'react';

const addBodyClass = (className) => {
  if (typeof document !== 'undefined') {
    document.body.classList.add(className);
  }
};

const removeBodyClass = (className) => {
  if (typeof document !== 'undefined') {
    document.body.classList.remove(className);
  }
};

/**
 * Custom hook to add/remove class names to the body element
 * SSR-safe for Next.js
 * @param {string|string[]} className - Single class or array of classes to add to body
 */
export default function useBodyClass(className) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Set up
    if (className instanceof Array) {
      className.forEach(addBodyClass);
    } else {
      addBodyClass(className);
    }

    // Clean up
    return () => {
      if (className instanceof Array) {
        className.forEach(removeBodyClass);
      } else {
        removeBodyClass(className);
      }
    };
  }, [className]);
}
