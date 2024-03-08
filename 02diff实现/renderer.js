const h = (tag, props, children) => {

  return { tag, props, children };
};


const mount = (vnode, container) => {
  // 1. 创建出真实的Dom，并在 vnode 上记录 el
  // vnode -> element
  const el = vnode.el = document.createElement(vnode.tag);

  // 2. 处理 props
  if (vnode.props) {
    Object.keys(vnode.props).forEach(key => {
      const value = vnode.props[key];

      // if (key.startsWith('on')) { // 判断是否为事件
      //   el.addEventListener(key.slice(2).toLowerCase(), value);
      // } else {
      //   el.setAttribute(key, value);
      // }

      resolveProp(key, value, el)

    });
  }

  // 3. 处理 children
  if (vnode.children) {
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach(child => {
        mount(child, el);
      });
    }
  }

  // 4. 将 el 挂载到 container 上
  container.appendChild(el);

}

/**
 * patch方法
 * @param {*} n1 
 * @param {*} n2 
 * 
 */
const patch = (n1, n2) => {
  // 1. 不是同一类型的标签，直接替换
  if (n1.tag !== n2.tag) { // 不是同一类型的标签
    const n1ElParent = n1.el.parentElement;
    n1ElParent.removeChild(n1.el);

    mount(n2, n1ElParent);
  } else {
    // 1. 取出 element，直接复用
    const el = n2.el = n1.el;
    
    // 2. 处理 props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    Object.keys(newProps).forEach(key => {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        resolveProp(key, newValue, el)
      }
    });

    Object.keys(newProps).forEach(key => {
      if (oldProps[key]) {
        if (key.startsWith('on')) {
          el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key])
        } else {
          el.removeAttribute(key, oldProps[key])
        }
      }
    })

    // 3. 处理 children
    // * 1. n1为字符串，
    //   1.1 n2为字符串   直接替换
    //   1.2 n2为数组     直接替换
    // * 2. n1为数组
    //   2.1 n2为字符串   直接替换
    //   2.2 n2为数组     diff算法
    const oldChildren = n1.children || []
    const newChildren = n2.children || []
    if (typeof newChildren === 'string') {

      if (newChildren !== oldChildren) {

        el.textContent = newChildren
      }
    } else {
      // 数组 diff
      if (typeof oldChildren === 'string') {
        el.innerHTML = ''
        
        newChildren.forEach((item, index) => {
          mount(item, el)
        })
      } else {

        const commonLength = Math.min(newChildren.length, oldChildren.length)

        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i])
        }

        if (oldChildren.length > newChildren.length) {
          oldChildren.slice(newChildren.length).forEach(item => {
            el.removeChild(item.el)
          })
        }

        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach(item => {
            mount(item, el)
          })
        }
      }
    }

  }
}




/**
 * 处理Props项
 * @param {c} key 
 * @param {*} value 
 * @param {*} el 
 */
const resolveProp = (key, value, el) => {
  if (key.startsWith('on')) { // 判断是否为事件
    el.addEventListener(key.slice(2).toLowerCase(), value);
  } else {
    el.setAttribute(key, value);
  }
}