function createApp(App) {
  return {
    mount(selector) {
      const container = document.querySelector(selector)

      let isMounted = false
      let oldVNode = null
      watchEffect(() => {
        if (!isMounted) {

          oldVNode = App.render()
          mount(oldVNode, container)
          isMounted = true
        } else {
          const newVNode = App.render()
          if (oldVNode !== newVNode) {

            patch(oldVNode, newVNode)
            oldVNode = newVNode
          }
        }
      })
    }
  }
}
