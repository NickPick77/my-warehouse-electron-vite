import { Directive, DirectiveBinding } from 'vue'

const clickOutsideEvent = (event: Event, hostEl: Node, binding?: DirectiveBinding) => {
  console.log('clickOutsideEvent', event.target)
  if (hostEl === event.target) {
    binding?.value(event)
  }
}

const vClickOutside: Directive<Node, (event: Event) => void> = {
  beforeMount(hostEl: Node, binding: DirectiveBinding) {
    hostEl.addEventListener('click', ($event) => clickOutsideEvent($event, hostEl, binding))
  },
  unmounted(hostEl: Node) {
    hostEl.removeEventListener('click', ($event) => clickOutsideEvent($event, hostEl))
  }
}

export default vClickOutside
