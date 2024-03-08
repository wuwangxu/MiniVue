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

  Object.keys(raw).forEach(key => {
    const dep = getDep(raw, key)
    let value = raw[key]


    // Vue2 的实现
    Object.defineProperty(raw, key, {
      get() {
        dep.depend()

        return value
      },

      set(newValue) {
        if (value !== newValue) {
          value = newValue
          dep.notify()
        }
      }
    })


  })
  return raw

}


const person = reactive({name: 'wangxu', age: 12})
const animal = reactive({name: 'dog'})

watchEffect(() => {
  console.log(`effect1: ${person.name} is ${person.age}`)
})

watchEffect(() => {
  console.log(`effect2: hello ${person.name}`)
})

watchEffect(() => {
  console.log(`effect3: ${person.name} has a ${animal.name}`)
})

watchEffect(() => {
  console.log(`effect4: animal is ${animal.name}`)
})

setTimeout(() => {
  // person.name = 'xu'
  animal.name = 'cat'
}, 1000)