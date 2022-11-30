import { Routes } from '@nestjs/core'

interface RouterInterface {
  resource(
    path: string,
    module: any,
    sub?: (r: RouterInterface) => void,
    list?: Routes,
  ): any
}

export class Router {
  routes: Routes = []

  resource(
    path: string,
    module: any,
    sub?: (r: RouterInterface) => void,
    list?: Routes,
  ) {
    const data = {
      path,
      module,
      children: [],
    }
    const addChild = (
      path: string,
      module: any,
      sub?: (r: RouterInterface) => void,
    ) => {
      this.resource(path, module, sub, data.children)
    }
    if (sub) sub({ resource: addChild })
    if (list) list.push(data)
    else this.routes.push(data)
    return
  }
}
