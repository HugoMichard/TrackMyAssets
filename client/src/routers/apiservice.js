import axios from 'axios'
const API_URL = 'http://localhost:3000'

export class APIService {
  // eslint-disable-next-line no-useless-constructor
  constructor () {}

  formatSearch (data) {
    data = JSON.parse(JSON.stringify(data))
    var search = '?'
    Object.entries(data).forEach(([key, value]) => {
      if (value || value === false) {
        search += key + '=' + value + '&'
      }
    })
    search = search.slice(0, -1)
    return search
  }

  // user methods
  register (data) {
    const url = `${API_URL}/api/register`
    return axios.post(url, data)
  }

  // book methods
  createBook (data) {
    const url = `${API_URL}/api/book`
    axios.post(url, data).then(function (res) { window.location = '/' })
  }
  searchBook (data) {
    const url = `${API_URL}/api/book`
    var search = this.formatSearch(data)
    const request = axios.get(url + search)
    return request.then(result => { return result.data })
  }
  getBook (bokId) {
    const url = `${API_URL}/api/book/` + bokId
    return axios.get(url)
  }
}
