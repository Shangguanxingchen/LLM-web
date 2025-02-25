import fetch from './fetch'
export function getToken(data) {
    return fetch({
      url: "http://amcoder/user_sign",
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
// export function getQwenAnswer(data) {
//     return fetch({
//       url: "/stuck_work/api/qwen_7b_api/",
//       method: `POST`,
//       data,
//     })
// }
// export function getSeekAnswer(data) {
//     return fetch({
//       url: "/stuck_work/api/seek/",
//       method: `POST`,
//       data,
//     })
// }
// export function getGpt4Answer(data) {
//     return fetch({
//       url: "/az_chat/f_chat",
//       method: `POST`,
//       data,
//     })
// }
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