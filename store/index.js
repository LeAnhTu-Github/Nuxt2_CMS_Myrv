import Vuex from 'vuex'
import axios from 'axios'
import userInfoModule from './modules/userInfo'
const userModule = {
  namespaced: true,
  
  state: () => ({
    user: {
      username: '',
      password: '',
    },
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  mutations: {
    setUser(state, user) {
      state.user = { ...state.user, ...user }
    },
    
    setToken(state, token) {
      state.token = token
    },
    
    setAuthenticated(state, status) {
      state.isAuthenticated = status
    },
    
    setLoading(state, status) {
      state.loading = status
    },
    
    setError(state, error) {
      state.error = error
    },
    
    clearUser(state) {
      state.user = {
        username: '',
        password: '',
      }
      state.token = null
      state.isAuthenticated = false
      state.error = null
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        commit('setLoading', true)
        commit('setError', null)
        const response = await axios.post(
          `https://cmsmyrv.xteldev.com/api/auth/login`,
          {
            username: credentials.username,
            password: credentials.password
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        if (response.data && response.data.data.token) {
          const { token } = response.data.data
          
          if (process.client) {
            localStorage.setItem('auth_token', token)
          }
          
          commit('setToken', token)
          commit('setAuthenticated', true)
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // await dispatch('userInfoStore/fetchUserInfo', null, { root: true })
          return { success: true, data: response.data.data }
        }
        
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed'
        
        commit('setError', errorMessage)
        commit('setAuthenticated', false)
        
        return { success: false, error: errorMessage }
      } finally {
        commit('setLoading', false)
      }
    },
    
    async logout({ commit, dispatch }) {
      try {
        if (process.client) {
          localStorage.removeItem('auth_token')
        }
        
        delete axios.defaults.headers.common['Authorization']
        
        // Clear user module state
        commit('clearUser')
        
        // Clear userInfo module state
        await dispatch('userInfoStore/clearUserInfo', null, { root: true })
        
        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        return { success: false, error: error.message }
      }
    },
    
    async checkAuth({ commit, dispatch }) {
      try {
        if (process.client) {
          const token = localStorage.getItem('auth_token')
          
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            commit('setToken', token)
            commit('setAuthenticated', true)
            
            // Fetch user info after setting token
            await dispatch('userInfoStore/fetchUserInfo', null, { root: true })
            
            return { success: true }
          }
        }
        
        return { success: false }
      } catch (error) {
        if (process.client) {
          localStorage.removeItem('auth_token')
        }
        commit('clearUser')
        await dispatch('userInfoStore/clearUserInfo', null, { root: true })
        return { success: false, error: error.message }
      }
    },
    
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    
    clearError({ commit }) {
      commit('setError', null)
    }
  },

  getters: {
    getUser(state) {
      return state.user
    },
    
    getToken(state) {
      return state.token
    },
    
    isAuthenticated(state) {
      return state.isAuthenticated
    },
    
    isLoading(state) {
      return state.loading
    },
    
    getError(state) {
      return state.error
    },
    
    getUserId(state) {
      return state.user.id
    },
    
    getUsername(state) {
      return state.user.username
    }
  }
}

const createStore = () => {
  return new Vuex.Store({
    modules: {
      userStore: userModule,
      userInfoStore: userInfoModule
    }
  })
}

export default createStore