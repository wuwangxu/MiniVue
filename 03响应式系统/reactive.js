class Dep {
  constructor() {
    this.subscribers = new Set()
  }

  depend() {
    if (currentEffect) {

      this.subscribers.add(currentEffect)
    }

  }

  notify() {
    this.subscribers.forEach(effect => {
      effect()
    })
  }

}

let currentEffect = null
function watchEffect(effect) {
  currentEffect = effect
  effect()
  currentEffect = null
}

/**
 * 为每个 target.key 定义一个dep
 */
const targetMap = new WeakMap()
function getDep(target, key) {
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }

  return dep

}

function reactive(raw) {


  return new Proxy(raw, {
    get(target, p, receiver) {
      const dep = getDep(target, p)
      dep.depend()
      return target[p]
    },
    
    set(target, p, newValue, receiver) {
      if (target[p] !== newValue) {
        target[p] = newValue
        const dep = getDep(target, p)
        dep.notify()
      }
    }
  })

}


