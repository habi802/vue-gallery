<script setup>
  import { onMounted } from 'vue';
  import { getItems } from '@/services/itemService';

  onMounted(async () => {
    const res = await getItems();

    if (res === undefined || res.status !== 200) {
      return;
    }

    console.log(res.data);
  });
</script>

<template>
  <div class="container">
    <h1 class="mt-5">HELLO, HOME</h1>
  </div>
</template>

<style scoped>

</style>
