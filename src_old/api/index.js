import fetch from './fetch'
export function getToken(data) {
    return fetch({
      url: "user_sign",
      method: `POST`,
      data,
    })
}
export function getAnswer(data) {
    return fetch({
      url: "qa",
      method: `POST`,
      data,
    })
}
export function isLike(data) {
    return fetch({
      url: "qa",
      method: `PUT`,
      data,
    })
}
export function getHistoryList(params) {
    return fetch({
      url: `qa?user=${params.user}`,
      method: `get`,
    })
}
export function addHistoryList(data) {
    return fetch({
      url: "qau",
      method: `post`,
      data
    })
}