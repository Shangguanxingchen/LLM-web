import fetch from './fetch'
export function getChatgptAnswer(data) {
    return fetch({
      url: "stuck_work/api/qwen_7b_api/",
      method: `POST`,
      data,
    })
}
export function getQwenAnswer(data) {
    return fetch({
      url: "http://10.34.37.5:8000/stuck_work/api/qwen_7b_api/",
      method: `POST`,
      data,
    })
}
export function getSeekAnswer(data) {
    return fetch({
      url: "http://10.34.37.5:8000/stuck_work/api/seek/",
      method: `POST`,
      data,
    })
}
export function getGpt4Answer(data) {
    return fetch({
      url: "https://bot.chinaamc.com/az_chat/f_chat",
      method: `POST`,
      data,
    })
}