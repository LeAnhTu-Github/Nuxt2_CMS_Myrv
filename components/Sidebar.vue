<script lang="ts">
import SidebarItem from './SidebarItem.vue'
import { PageRole } from '~/types/UserInfo'
import { PropType } from 'vue'  
export default {
  name: 'Sidebar',
  data() {
    return {
      isShowModal: false,
    }
  },
  props: {
    pageRoles: {
      type: Array as PropType<PageRole[]>,
      required: true
    },
    userInfo: {
      type: Object as PropType<{ username: string; phone: string }>,
      required: true
    },
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    parentItems() {
      return this.pageRoles.filter(item => item.level === 1).sort((a, b) => a.menuIndex - b.menuIndex)
    },
    getChildren() {
      const map: { [key: number]: PageRole[] } = {}
      this.pageRoles.forEach(item => {
        if (item.level === 2) {
          if (!map[item.parentId]) map[item.parentId] = []
          map[item.parentId].push(item)
        }
      })
      Object.values(map).forEach(arr => arr.sort((a, b) => a.menuIndex - b.menuIndex))
      return map
    }
  },
  methods: {
    handleShowModal() {
      this.isShowModal = !this.isShowModal
    }
  }
}
</script>

<template>
  <aside 
    class="flex flex-col justify-between h-full bg-white border-r border-gray-200 transition-all duration-300"
    :class="[isCollapsed ? 'w-16' : 'w-72']"
  >
    <div>
      <div class="flex items-center justify-between py-6 px-4">
        <img 
          v-if="!isCollapsed" 
          src="~/assets/images/logo.webp" 
          alt="Favicon"
        />
        <img 
          v-else 
          src="~/assets/images/favicon.webp" 
          alt="Logo"
        />
      </div>
      <nav class="flex-1 px-2 space-y-1">
        <SidebarItem
          v-for="item in parentItems"
          :key="item.id"
          :item="item"
          :children="getChildren[item.id] || []"
          :is-collapsed="isCollapsed"
        />
      </nav>
    </div>
    <div class="mt-auto flex items-center gap-3 px-4 py-4 bg-white border-t border-gray-100">
      <v-menu
        offset-y
        top
        :close-on-content-click="false"
        transition="scale-transition"
        :offset="[0, -10]"
      >
        <template #activator="{ on: menuOn, attrs: menuAttrs }">
          <div
            class="w-full h-full flex items-center cursor-pointer justify-between"
            v-on="menuOn"
            v-bind="menuAttrs"
            tabindex="0"
            aria-label="User menu"
            @keydown.enter="menuOn.click"
          >
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
              {{ userInfo.username?.slice(0, 2).toUpperCase() }}
            </div>
            <div v-if="!isCollapsed" class="flex flex-col ml-3">
              <span class="font-semibold text-sm">{{ userInfo.username }}</span>
              <span class="text-sm text-gray-500">{{ userInfo.phone }}</span>
            </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-chevrons-down ml-auto size-4" data-sentry-element="IconChevronsDown" data-sentry-source-file="app-sidebar.tsx"><path d="M7 7l5 5l5 -5"></path><path d="M7 13l5 5l5 -5"></path></svg>
          </div>
        </template>
        <v-list class="min-w-[200px] bg-white rounded-2xl shadow-sm p-1 ">
          <v-list-item class="border-b border-gray-100 h-8 rounded-xl ">
            <div
            class="w-full h-full flex items-center cursor-pointer justify-between"
          >
            <div class="flex items-center">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-sm font-bold text-gray-700">
              {{ userInfo.username?.slice(0, 2).toUpperCase() }}
            </div>
            <div v-if="!isCollapsed" class="flex flex-col ml-3">
              <span class="font-semibold text-sm">{{ userInfo.username }}</span>
              <span class="text-sm text-gray-500">{{ userInfo.phone }}</span>
            </div>
            </div>
            </div>
          </v-list-item>
          <v-list-item
            tabindex="0"
            aria-label="Profile"
            class="hover:bg-gray-100 cursor-pointer border-b border-gray-100 h-8"
            @click="$emit('profile')"
            @keydown.enter="$emit('profile')"
          >
            <div class="w-10">
              <v-icon class="text-xs">mdi-account-circle</v-icon>
            </div>
            <v-list-item-content>
              <v-list-item-title class="text-sm">Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            tabindex="0"
            aria-label="Sign Out"
            class="hover:bg-gray-100 cursor-pointer h-8"
            @click="$emit('signOut')"
            @keydown.enter="$emit('signOut')"
          >
            <div class="w-10">
              <v-icon class="text-xs">mdi-logout</v-icon>
            </div>
            <v-list-item-content>
              <v-list-item-title class="text-sm">Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </aside>
</template>