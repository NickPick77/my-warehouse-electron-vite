import { RouteLocation } from 'vue-router'

/**
 * This middleware is used to dynamically update the Layouts system.
 *
 * As soon as the route changes, it tries to pull the layout that we want to display from the laptop. Then it loads the layout component, and assigns the loaded component to the meta in the layout Component variable. And layoutComponent is used in the basic layout AppLayout.vue, there is a dynamic update of the layout component
 *
 * If the layout we want to display is not found, loads the default layout App Layout Default.vue
 * */
export async function loadLayoutMiddleware(route: RouteLocation) {
  try {
    const layout: string = route.meta.layout as string

    if (!layout) {
      return
    }

    const layoutComponent = await import(`@renderer/layouts/${layout}.vue`)
    route.meta.layoutComponent = layoutComponent.default
  } catch (e) {
    console.error('Error occurred in processing of layouts: ', e)
    const layout = 'AppLayoutDefault'
    const layoutComponent = await import(`@renderer/layouts/${layout}.vue`)
    route.meta.layoutComponent = layoutComponent.default
  }
}
