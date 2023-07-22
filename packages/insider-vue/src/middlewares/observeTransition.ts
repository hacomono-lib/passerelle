import type { Communicator } from "@passerelle/insider-core";
import type { Router } from "vue-router";

export function applyMiddleware(router: Router, communicator: Communicator) {
  router.beforeEach((to, _from, next) => {
    communicator.navigate({ path: to.path, params: to.params })
    return next()
  })
}
