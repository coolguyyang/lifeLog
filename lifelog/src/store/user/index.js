/*******************************************************************
 * @Desc         : 
 * @Author       : YZB
 * @Date         : 2022-03-25 16:25:19
 * @LastEditors  : YZB
 * @LastEditTime : 2022-03-25 16:57:16
*******************************************************************/
const user = {
  state: {
    uid: '',
    name: '',
    tel: '',
    token: ''
  },
  mutations: {
    SET_UID (state, uid) {
      state.uid = uid
    },
    SET_NAME (state, name) {
      state.name = name
    },
    SET_TEL (state, tel) {
      state.tel = tel
    },
    SET_TOKEN (state, token) {
      state.token = token
    }
  },
  getters: {
    uid: state => state.uid,
    name: state => state.name,
    tel: state => state.tel,
    token: state => state.token
  },
  actions: {
    LoginAction ({ commit }, userinfo) {
      commit('SET_UID', userinfo.uid)
      commit('SET_NAME', userinfo.name)
      commit('SET_TEL', userinfo.tel)
      commit('SET_TOKEN', userinfo.token)
    },
    LogoutAction ({ commit }) {
      commit('SET_UID', '')
      commit('SET_NAME', '')
      commit('SET_TEL', '')
      commit('SET_TOKEN', '')
    }
  }
}
export default user