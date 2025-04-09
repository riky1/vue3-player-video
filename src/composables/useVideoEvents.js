import { onMounted, onUnmounted } from 'vue'

/**
 * Composable for Video Event Management
 * @param {Ref} videoRef - The reference to the video element
 * @param {Object} events - An event object with event names as keys and callback functions as values
 * @param {Function} [callback] - A function that runs for every event, receives (eventName, eventObject)
 */
export function useVideoEvents(videoRef, events, callback) {
  const listeners = {}

  onMounted(() => {
    if (!videoRef.value) return

    Object.keys(events).forEach((eventName) => {
      // create a wrapper function
      const wrappedHandler = (event) => {
        events[eventName](event) // call the specific callback
        
        if (typeof callback === 'function') {
          callback(eventName, event) // call the generic one
        }
      }

      // save the reference to remove it later
      listeners[eventName] = wrappedHandler
      videoRef.value.addEventListener(eventName, wrappedHandler)
    })
  })

  onUnmounted(() => {
    if (!videoRef.value) return

    Object.keys(listeners).forEach((eventName) => {
      videoRef.value.removeEventListener(eventName, listeners[eventName])
    })
  })
}
