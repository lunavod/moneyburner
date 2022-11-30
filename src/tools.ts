/* eslint-disable no-prototype-builtins */
export const serialize = (obj: Record<any, any>, prefix) => {
  const str = []
  let p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p]
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : encodeURIComponent(k) + '=' + encodeURIComponent(v),
      )
    }
  }
  return str.join('&')
}

export const asyncMap = <I, O>(
  arr: I[],
  func: (el: I, i: number) => Promise<O>,
): Promise<O[]> => {
  return Promise.all(arr.map(func))
}

export const asyncEach = async <I, O>(
  arr: I[],
  func: (el: I, i: number) => Promise<O>,
) => {
  await Promise.all(arr.map(func))
}
