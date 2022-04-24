import axios from 'axios'
import AuthService from 'services/auth'

const API_URL = `http://localhost:5000/api`

class APIService {
  
  // eslint-disable-next-line no-useless-constructor
  constructor () {}

  getUserHeader() {
    const user = AuthService.getCurrentUser();
    return {headers: {"x-access-token": user}}
  }

  formatSearch (data) {
    data = JSON.parse(JSON.stringify(data))
    var search = '?'
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        search += key + '=' + value + '&'
      }
    })
    search = search.slice(0, -1)
    return search
  }

  // deconnected methods
  register (data) {
    const url = `${API_URL}/auth/register`
    return axios.post(url, data)
  }

  login (data) {
    const url = `${API_URL}/auth/login`
    return axios.post(url, data)
  }

  sendContactMail(data) {
    const url = `${API_URL}/users/sendContactMail`
    return axios.post(url, data)
  }

  // user methods
  getUserLastRefresh () {
    const url = `${API_URL}/users/getLastRefresh`
    return axios.get(url, this.getUserHeader())
  }

  // asset methods
  createAsset (data) {
    const url = `${API_URL}/assets`
    return axios.post(url, data, this.getUserHeader())
  }

  updateAsset (data) {
    const url = `${API_URL}/assets/${data.ast_id}`
    return axios.post(url, data, this.getUserHeader())
  }

  searchAssets (data) {
    const url = `${API_URL}/assets`
    var search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader())
  }

  getAsset (astId) {
    const url = `${API_URL}/assets/` + astId
    return axios.get(url, this.getUserHeader())
  }

  getAssetsOwned () {
    const url = `${API_URL}/assets/getAssetsOwned`
    return axios.get(url, this.getUserHeader())
  }

  getAssetHistory (data) {
    var formattedData = this.formatSearch(data)
    const url = `${API_URL}/histories/asset/`
    return axios.get(url + formattedData, this.getUserHeader())
  }

  deleteAsset (astId) {
    const url = `${API_URL}/assets/` + astId
    return axios.delete(url, this.getUserHeader(), astId)
  }

  // order methods
  createOrder (data) {
    const url = `${API_URL}/orders`
    return axios.post(url, data, this.getUserHeader())
  }

  updateOrder (data) {
    const url = `${API_URL}/orders/${data.ord_id}`
    return axios.post(url, data, this.getUserHeader())
  }

  searchOrders (data) {
    const url = `${API_URL}/orders`
    var search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader())
  }

  getOrder (ordId) {
    const url = `${API_URL}/orders/` + ordId
    return axios.get(url, this.getUserHeader())
  }

  getOrdersOfAsset (astId) {
    const url = `${API_URL}/orders/getOrdersOfAsset/` + astId
    return axios.get(url, this.getUserHeader())
  }

  getBuyingQuantityOfAssetByDay (astId) {
    const url = `${API_URL}/orders/getBuyingQuantityOfAssetByDay/` + astId
    return axios.get(url, this.getUserHeader())
  }

  deleteOrder (ordId) {
    const url = `${API_URL}/orders/` + ordId
    return axios.delete(url, this.getUserHeader(), ordId)
  }

  uploadOrderCsv(data) {
    const url = `${API_URL}/orders/upload`
    const user = AuthService.getCurrentUser();
    return axios.post(url, data, { headers: {'Content-Type': 'multipart/form-data', "x-access-token": user} })
  }

  validateUploadOrderCsv(data) {
    const url = `${API_URL}/orders/upload/validate`
    return axios.post(url, data, this.getUserHeader())
  }

  // category methods
  createCategory (data) {
    const url = `${API_URL}/categories`
    return axios.post(url, data, this.getUserHeader())
  }

  updateCategory (data) {
    const url = `${API_URL}/categories/${data.cat_id}`
    return axios.post(url, data, this.getUserHeader())
  }

  searchCategories (data) {
    const url = `${API_URL}/categories`
    var search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader())
  }

  getCategory (cat_id) {
    const url = `${API_URL}/categories/${cat_id}`
    return axios.get(url, this.getUserHeader())
  }

  getPortfolioValueForeachCat () {
    const url = `${API_URL}/categories/getPortfolioValueForeachCat`
    return axios.get(url, this.getUserHeader())
  }

  getPortfolioValueForeachType () {
    const url = `${API_URL}/categories/getPortfolioValueForeachType`
    return axios.get(url, this.getUserHeader())
  }

  // dashboard methods
  getDashboardSummary () {
    const url = `${API_URL}/dashboard/summary`
    return axios.get(url, this.getUserHeader())
  }

  getPortfolioValueHistory(data) {
    var search = this.formatSearch(data)
    const url = `${API_URL}/dashboard/getPortfolioValueHistory`
    return axios.get(url + search, this.getUserHeader())
  }

  // portfolio methods
  refreshPortfolio() {
    const url = `${API_URL}/portfolio/refresh`
    return axios.get(url, this.getUserHeader())
  }

  getPortfolioPlusValueHistory(data) {
    var search = this.formatSearch(data)
    const url = `${API_URL}/portfolio/getPlusValueHistory`
    return axios.get(url + search, this.getUserHeader())
  }

  getInvestments(data) {
    var search = this.formatSearch(data)
    const url = `${API_URL}/portfolio/getInvestments`
    return axios.get(url + search, this.getUserHeader())
  }

  getCumulativeInvestmentsWithValue(data) {
    var search = this.formatSearch(data)
    const url = `${API_URL}/portfolio/getCumulativeInvestmentsWithValue`
    return axios.get(url + search, this.getUserHeader())
  }

  getInvestmentsSummary() {
    const url = `${API_URL}/portfolio/getInvestmentsSummary`
    return axios.get(url, this.getUserHeader())
  }

  getProfitsRealised() {
    const url = `${API_URL}/portfolio/getProfitsRealised`
    return axios.get(url, this.getUserHeader())
  }

  // platforms methods
  createPlatform (data) {
    const url = `${API_URL}/platforms`
    return axios.post(url, data, this.getUserHeader())
  }
  
  updatePlatform (data) {
    const url = `${API_URL}/platforms/${data.plt_id}`
    return axios.post(url, data, this.getUserHeader())
  }
  
  searchPlatforms (data) {
    const url = `${API_URL}/platforms`
    var search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader())
  }
  
  getPlatform (plt_id) {
    const url = `${API_URL}/platforms/${plt_id}`
    return axios.get(url, this.getUserHeader())
  }

  getPortfolioValueForeachPlt () {
    const url = `${API_URL}/platforms/getPortfolioValueForeachPlt`
    return axios.get(url, this.getUserHeader())
  }

  // wire methods
  createWire (data) {
    const url = `${API_URL}/wires`
    return axios.post(url, data, this.getUserHeader())
  }
  
  updateWire (data) {
    const url = `${API_URL}/wires/${data.wir_id}`
    return axios.post(url, data, this.getUserHeader())
  }
  
  searchWires () {
    const url = `${API_URL}/wires`
    return axios.get(url, this.getUserHeader())
  }
  
  getWire (wirId) {
    const url = `${API_URL}/wires/` + wirId
    return axios.get(url, this.getUserHeader())
  }

  deleteWire (wirId) {
    const url = `${API_URL}/wires/` + wirId
    return axios.delete(url, this.getUserHeader(), wirId)
  }

  getWireSummary () {
    const url = `${API_URL}/wires/getSummary`
    return axios.get(url, this.getUserHeader())
  }

  // dex methods
  searchDexs() {
    const url = `${API_URL}/dexs`
    return axios.get(url, this.getUserHeader())
  }

  searchWallets() {
    const url = `${API_URL}/dexs/wallets`
    return axios.get(url, this.getUserHeader())
  }

  searchPlatformDexs() {
    const url = `${API_URL}/dexs/platforms`
    return axios.get(url, this.getUserHeader())
  }

  // cmc coins methods
  searchCoins(data) {
    const url = `${API_URL}/assets/coins`
    const search = this.formatSearch(data)
    return axios.get(url + search, this.getUserHeader())
  }

}

export default new APIService();