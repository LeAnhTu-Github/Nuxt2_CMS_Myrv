<script lang="ts">
import { PageRole } from '~/types/UserInfo'
import { PropType } from 'vue'
export default {
  props: {
    item: {
      type: Object as PropType<PageRole>,
      required: true
    },
    children: {
      type: Array as PropType<PageRole[]>,
      required: true
    },
    isCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    handleToggle() {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<template>
  <div>
    <div
      class="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
      :class="{ 'justify-center': isCollapsed }"
      :tabindex="0"
      :aria-label="item.pageName"
      @click="children?.length ? handleToggle() : $router.push(item.pageUrl)"
      @keydown.enter="children?.length ? handleToggle() : $router.push(item.pageUrl)"
      @keydown.space.prevent="children?.length ? handleToggle() : $router.push(item.pageUrl)"
    >
      <span v-if="item.pageIcon" class="text-xl">
        
        <i :class="['mdi', item.pageIcon === 'mdi-file-document-box' ? 'mdi-text-box' : item.pageIcon]"></i>
      </span>
      <span v-if="!isCollapsed" class="flex-1 text-xs">{{ item.pageName }}</span>
      <span v-if="children?.length && !isCollapsed" class="ml-auto">
        <svg :class="['w-4 h-4 transition-transform', isOpen ? 'rotate-90' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </span>
    </div>
    <div v-if="children?.length && isOpen && !isCollapsed" class="ml-6 mt-1 space-y-1">
      <div
        v-for="child in children"
        :key="child.id"
        class="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
        :tabindex="0"
        :aria-label="child.pageName"
        @click="$router.push(child.pageUrl)"
        @keydown.enter="$router.push(child.pageUrl)"
        @keydown.space.prevent="$router.push(child.pageUrl)"
      >
        <span class="text-xs">{{ child.pageName }}</span>
      </div>
    </div>
  </div>
</template>