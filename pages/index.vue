<script lang="ts">
import Tutorial from '~/components/Tutorial.vue'

export default {
  name: 'Index',
  components: {
    Tutorial
  },
  head() {
    return {
      title: 'My page',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'My custom description'
        }
      ]
    }
  }
}
</script>

<template>
  <div>
    <Tutorial/>
  </div>
</template>

