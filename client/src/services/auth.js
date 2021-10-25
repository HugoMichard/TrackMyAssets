import APIService from 'routers/apiservice'


class AuthService {
  login(data) {
      return APIService.login(data)
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data.accessToken));
            }
            return response;
        }).catch((error) => {
            return error.response;
        });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();