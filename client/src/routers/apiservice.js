import axios from 'axios'
import AuthService from 'services/auth'

const API_URL = 'http://localhost:9000/api'

class APIService {
  
  // eslint-disable-next-line no-useless-constructor
  constructor () {}

  getUserHeader() {
    const user = AuthService.getCurrentUser();
    return {headers: {"x-access-token": user}}
  }

  formatSearch (data) {
    console.log("je format");
    console.log(data)
    data = JSON.parse(JSON.stringify(data))
    var search = '?'
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        search += key + '=' + value + '&'
      }
    })
    search = search.slice(0, -1)
    console.log(search)
    return search
  }

  // auth methods
  register (data) {
    const url = `${API_URL}/auth/register`
    return axios.post(url, data).then(res => { return res.data })
  }

  login (data) {
    const url = `${API_URL}/auth/login`
    return axios.post(url, data).then(res => { return res.data })
  }

  // asset methods
  createAsset (data) {
    const url = `${API_URL}/assets`
    return axios.post(url, data, this.getUserHeader()).then(res => { return res })
  }

  updateAsset (data) {
    const url = `${API_URL}/assets/${data.ast_id}`
    return axios.post(url, data, this.getUserHeader()).then(res => { return res })
  }

  searchAsset (data) {
    const url = `${API_URL}/assets`
    var search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader()).then(res => { return res })
  }

  getAsset (astId) {
    const url = `${API_URL}/assets/` + astId
    return axios.get(url, this.getUserHeader())
  }

  // category methods
  createCategory (data) {
    const url = `${API_URL}/categories`
    return axios.post(url, data, this.getUserHeader()).then(res => { return res })
  }

  updateCategory (data) {
    const url = `${API_URL}/categories/${data.cat_id}`
    return axios.post(url, data, this.getUserHeader()).then(res => { return res })
  }

  searchCategory (data) {
    const url = `${API_URL}/categories`
    var search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader()).then(res => { return res })
  }

  getCategory (cat_id) {
    const url = `${API_URL}/categories/${cat_id}`
    return axios.get(url, this.getUserHeader()).then(res => { return res })
  }

  // book methods
  createBook (data) {
    const url = `${API_URL}/book`
    axios.post(url, data).then(function (res) { window.location = '/' })
  }
  searchBook (data) {
    const url = `${API_URL}/book`
    var search = this.formatSearch(data)
    const request = axios.get(url + search)
    return request.then(result => { return result.data })
  }
  getBook (bokId) {
    const url = `${API_URL}/book/` + bokId
    return axios.get(url)
  }

}

export default new APIService();