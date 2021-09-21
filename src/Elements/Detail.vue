<template>
  <div class="border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div v-for="key in Object.keys(data)" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <slot :name="`row.${key}`" :value="data[key]">
          <dt class="capitalize text-sm font-medium text-gray-500">
            <slot :name="`key.${key}`" :value="data[key]">
              {{  key.replaceAll('_', ' ')  }}
            </slot>
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <slot :name="`value.${key}`" :value="data[key]">
              {{  data[key]  }}
            </slot>
          </dd>
        </slot>
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