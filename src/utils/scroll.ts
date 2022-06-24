const scrollTo = (target: string) => {
  const anchor = document.getElementById(target)
  if (anchor) {
    document.body.scrollTop = anchor.offsetTop
    document.documentElement.scrollTop = anchor.offsetTop
    window.pageYOffset = anchor.offsetTop
  }
}

export {
  scrollTo
}
