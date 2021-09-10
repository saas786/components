<template>
  <div class="border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div v-for="key in Object.keys(data)" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="capitalize text-sm font-medium text-gray-500">
          {{  key.replaceAll('_', ' ')  }}
        </dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          {{  data[key]  }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>