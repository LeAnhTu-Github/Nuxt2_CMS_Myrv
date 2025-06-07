<script lang="ts">
import SidebarItem from './SidebarItem.vue'
import { PageRole } from '~/types/UserInfo'
import { PropType } from 'vue'  
export default {
  name: 'Sidebar',
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
      <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-lg font-bold text-gray-700">
        {{ userInfo.username?.slice(0, 2).toUpperCase() }}
      </div>
      <div v-if="!isCollapsed" class="flex flex-col">
        <span class="font-semibold text-base">{{ userInfo.username }}</span>
        <span class="text-sm text-gray-500">{{ userInfo.phone }}</span>
      </div>
      <button
        v-if="!isCollapsed"
        class="ml-auto"
        tabindex="0"
        aria-label="User menu"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>
  </aside>
</template>