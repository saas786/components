<template>
  <div class="bg-white flex p-5 space-x-4 border-b    ">
    <div class="flex-1">
      <div class="relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input autocomplete="off" v-query type="text" name="search" id="search" class="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search">
      </div>
    </div>

    <jet-select :options="sort" empty="Sort" v-query />
  </div>
</template>

<script>
import JetInput from '@/Jetstream/Input'
import {JetSelect} from '@jetstreamkit/components'

export default {
  props: ['sort'],
  components: {
    JetInput,
    JetSelect,
  }
}
</script>

