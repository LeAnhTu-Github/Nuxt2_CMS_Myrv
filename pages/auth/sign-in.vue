<script lang="ts">
import { mapGetters, mapActions } from 'vuex'

interface FormData {
  username: string
  password: string
}

export default {
  name: 'SignIn',
  layout: 'blank',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      } as FormData,
      showPassword: false,
      showToasterSuccess: false,
      showToasterError: false,
      toasterMessage: ''
    }
  },

  computed: {
    ...mapGetters('userStore', {
      storeIsLoading: 'isLoading',
      storeError: 'getError'
    }),
    isLoading(): boolean {
      return this.storeIsLoading
    },
    error(): string | null {
      return this.storeError
    }
  },

  methods: {
    ...mapActions('userStore', ['login', 'clearError']) as any,

    handleTogglePassword(): void {
      this.showPassword = !this.showPassword
    },

    async handleSubmit(): Promise<void> {
      try {
        const result = await this.login({
          username: this.formData.username,
          password: this.formData.password
        })
        if (result.success) {
          this.showToasterSuccess = true
          this.toasterMessage = 'Đăng nhập thành công!'
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }else{
          this.showToasterError = true
          this.toasterMessage = result.error
          setTimeout(() => {
            this.showToasterError = false
          }, 1500)
        }
      } catch (error) {
        console.error('Sign in error:', error)
      }
    },

    handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Enter') {
        this.handleSubmit()
      }
    },

    handleClearError(): void {
      this.clearError()
    }
  }
}
</script>
<template>
  <div class="container">
   <v-snackbar
    v-model="showToasterSuccess"
    color="success"
    timeout="1500"
    absolute
    top
    right
    icon="mdi-check-circle"
   >
    {{ toasterMessage }}
   </v-snackbar>
   <v-snackbar
    v-model="showToasterError"
    color="error"
    timeout="1500"
    absolute
    top
    right
    icon="mdi-alert-circle"
   >
    {{ toasterMessage }}
   </v-snackbar>
    <div class="banner-section">
      <div class="logo-section">
        <img 
          src="~/assets/images/logo.webp" 
          alt="MyReview Logo"
          class="logo"
        >
      </div>
      <div class="quote-section">
        <blockquote class="quote-text">
          "Design is not just what it looks like and feels like. Design is how it works."
        </blockquote>
        <div class="author-container">
          <div class="avatar">
            <span class="avatar-text">SJ</span>
          </div>
          <div class="author-info">
            <div class="author-name">Steve Jobs</div>
            <div class="author-title">Co-founder, Apple Inc.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-section">
      <div class="form-container">
        <div class="header">
          <h1 class="title">
            Welcome back
          </h1>
          <p class="subtitle">
            Enter your username to sign in to your account
          </p>
        </div>  
        <form @submit.prevent="handleSubmit" class="form">
          <div class="field">
            <label 
              for="username" 
              class="label"
            >
              Username
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              placeholder="username"
              class="input"
              :disabled="isLoading"
              @keydown="handleKeyDown"
              @focus="handleClearError"
            >
          </div>
          <div class="field">
            <label 
              for="password" 
              class="label"
            >
              Password
            </label>
            <div class="password-container">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••"
                class="input password-input"
                :disabled="isLoading"
                @keydown="handleKeyDown"
                @focus="handleClearError"
              >
              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                tabindex="0"
                :disabled="isLoading"
                @click="handleTogglePassword"
                @keydown.enter="handleTogglePassword"
                @keydown.space.prevent="handleTogglePassword"
              >
                <svg 
                  class="eye-icon" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    v-if="!showPassword"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path 
                    v-if="!showPassword"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                  />
                  <path 
                    v-if="showPassword"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            class="submit-button"
            :class="{ disabled: !formData.username || !formData.password || isLoading }"
            :disabled="!formData.username || !formData.password || isLoading"
            :aria-label="'Sign in to your account'"
          >
            <div v-if="isLoading" class="loading-content">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle class="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Signing In...</span>
            </div>
            <span v-else>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.banner-section {
  width: 50%;
  height: 100%;
  background: linear-gradient(to bottom right, #475569, #334155, #1e293b);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
}

.logo-section {
  display: flex;
  align-items: flex-start;
}

.logo {
  width: 320px;
  height: 112px;
  object-fit: contain;
}

.quote-section {
  color: white;
}

.quote-text {
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 16px;
  margin: 0 0 16px 0;
}

.author-container {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #9ca3af;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.author-name {
  font-weight: 400;
}

.author-title {
  font-size: 14px;
  color: #d1d5db;
}
.form-section {
  width: 50%;
  height: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.form-container {
  width: 100%;
  max-width: 450px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
}

.header {
  margin-bottom: 32px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: transparent;
  box-shadow: 0 0 0 2px #3b82f6;
}

.input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.input::placeholder {
  color: #9ca3af;
}

.password-container {
  position: relative;
}

.password-input {
  padding-right: 40px;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.password-toggle:focus {
  outline: none;
}

.eye-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.password-toggle:hover .eye-icon {
  color: #6b7280;
}

.submit-button {
  width: 100%;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.submit-button:hover:not(.disabled) {
  background-color: #1d4ed8;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.submit-button.disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.loading-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  color: white;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  opacity: 0.25;
}

.spinner-path {
  opacity: 0.75;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: flex;
  }
  
  .banner-section{
    display: none;
  }
  .form-section {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .banner-section {
    padding: 16px;
  }
  
  .form-section {
    padding: 16px;
  }
  
  .logo {
    width: 240px;
    height: 84px;
  }
  
  .quote-text {
    font-size: 16px;
  }
}
</style>