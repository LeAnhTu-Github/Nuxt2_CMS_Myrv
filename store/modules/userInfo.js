import axios from 'axios'
const userInfoModule = {
  namespaced: true,
  
  state: () => ({
    userInfo: null,
    navigation: [],
    groups: [],
    loading: false,
    error: null
  }),

  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setNavigation(state, navigation) {
      state.navigation = navigation
    },
    setGroups(state, groups) {
      state.groups = groups
    },
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, error) {
      state.error = error
    },
    clearUserInfo(state) {
      state.userInfo = null
      state.navigation = []
      state.groups = []
      state.error = null
    }
  },

  actions: {
    async fetchUserInfo({ commit }) {
      try {
        commit('setLoading', true)
        commit('setError', null)
        
        const response = await axios.get('https://cmsmyrv.xteldev.com/api/user/info')
        
        if (response.data && response.data.code === 'success') {
          const { user, pageRoles, groups } = response.data.data
          
          commit('setUserInfo', user)
          commit('setNavigation', pageRoles)
          commit('setGroups', groups)
          return { success: true, data: response.data.data }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to fetch user info'
        
        commit('setError', errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        commit('setLoading', false)
      }
    },
    
    clearUserInfo({ commit }) {
      commit('clearUserInfo')
    }
  },

  getters: {
    getUserInfo: state => state.userInfo,
    getNavigation: state => state.navigation,
    getGroups: state => state.groups,
    isLoading: state => state.loading,
    getError: state => state.error
  }
}

export default userInfoModule