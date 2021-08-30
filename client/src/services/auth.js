import APIService from 'routers/apiservice'


class AuthService {
  login(data) {
      return APIService.login(data)
        .then((response) => {
            if (response.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.accessToken));
            }
            return response;
        }).catch((error) => {
            return error;
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