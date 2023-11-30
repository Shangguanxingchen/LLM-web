export function getTime() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const newValue = `${year}-${month.toString().padStart(2, `0`)}-${date
      .toString()
      .padStart(2, `0`)} ${hours.toString().padStart(2, `0`)}:${minutes
      .toString()
      .padStart(2, `0`)}:${seconds.toString().padStart(2, `0`)}`
    return newValue
}