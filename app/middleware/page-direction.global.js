// Slide pages left when going deeper (/ -> /projects -> /projects/x), right when going back up.
export default defineNuxtRouteMiddleware((to, from) => {
  const depth = (route) => route.path.split("/").filter(Boolean).length;
  to.meta.pageTransition = {
    name: depth(to) < depth(from) ? "slide-right" : "slide-left",
    mode: "out-in",
  };
});
