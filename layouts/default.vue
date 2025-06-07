<script lang="ts">
import Sidebar from '../components/Sidebar.vue'
import { mapActions, mapGetters } from 'vuex'
import { PageRole, User, ResponseData } from '../types/UserInfo'

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      pageRoles: [] as PageRole[],
      userInfo: {} as User,
      data: {} as ResponseData,
      isCollapsed: false,
      isShowModal: false,
    }
  },
  computed: {
    ...mapGetters('userStore', [
      'isAuthenticated',
      'isLoading'
    ])
  },
  methods: {
    ...mapActions('userStore', ['checkAuth', 'logout']),
    ...mapActions('userInfoStore', ['fetchUserInfo']),
    async handleLogout() {
      try {
        const result = await this.logout()
        
        if (result.success) {
          this.$router.push('/auth/sign-in')
        }
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    handleKeyDownLogout(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.handleLogout()
      }
    },
    handleToggleSidebar() {
      this.isCollapsed = !this.isCollapsed
    },
    handleCheckScreenSize() {
      this.isCollapsed = window.innerWidth < 768
    },
  },
  async mounted() {
    try {
      const authResult = await this.checkAuth()
      
      if (!authResult.success) {
        this.$router.push('/auth/sign-in')
      }
      const result = await this.fetchUserInfo()
      if(result.success && result.data) {
        this.data = result.data
        this.pageRoles = result.data.pageRoles
        this.userInfo = result.data.user
      }
    } catch (error) {
      console.error('Auth check error:', error)
      this.$router.push('/auth/sign-in')
    }
    window.addEventListener('resize', this.handleCheckScreenSize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleCheckScreenSize)
  }
}
</script>

<template>
  <v-app>
    <div class="layout-container">
    <Sidebar :pageRoles="pageRoles" :userInfo="userInfo" :isCollapsed="isCollapsed" />
    <div class="right-content">
      <header class="header">
        <button
          class="p-1 rounded-lg hover:bg-gray-100 transition w-8"
          tabindex="0"
          aria-label="Toggle sidebar"
          @click="handleToggleSidebar"
          @keydown.enter="handleToggleSidebar"
          @keydown.space.prevent="handleToggleSidebar"
        >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="w-5 h-5 text-gray-600"
            :class="{ 'rotate-180': isCollapsed }"
          >
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M9 3v18"></path>
          </svg>
        </button>
        <div class="user-info">
          <h2 class="welcome-text">Welcome {{data.user?.username}} - {{data.user?.phone}}</h2>
        </div>
        <button
          class="logout-button"
          tabindex="0"
          aria-label="Sign out of your account"
          @click="handleLogout"
          @keydown="handleKeyDownLogout"
        >
          <svg class="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </header> 
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner">
          <svg class="spinner" viewBox="0 0 24 24">
            <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <span class="loading-text">Loading...</span>
        </div>
      </div>
      <main v-else-if="isAuthenticated" class="main-content">
        <nuxt />
      </main>
    </div>
  </div>
  </v-app>
</template>

<style scoped>
.layout-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  height: 60px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: start;
}

.welcome-text {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  text-align: left;
  margin: 0;
}

.logout-button {
  display: flex;
  align-items: center;
  max-width: 100px;
  gap: 8px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.logout-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #dc2626, 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.logout-button:active {
  transform: translateY(0);
}

.logout-icon {
  width: 18px;
  height: 18px;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: #f9fafb;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

.loading-text {
  font-size: 16px;
  color: #6b7280;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }
  .user-info {
    flex-direction: column;
    align-items: start;
    gap: 4px;
  }
  .header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    height: auto;
  }
  
  .welcome-text {
    font-size: 18px;
    text-align: left;
  }
  
  .logout-button {
    justify-content: center;
  }
  
  .main-content {
    padding: 16px;
  }
}
</style>