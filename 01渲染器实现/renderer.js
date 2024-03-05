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

      if (key.startsWith('on')) { // 判断是否为事件
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
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