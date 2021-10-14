<template>
  <div class="flex space-x-4">
    <div class="flex-1">
      <div class="relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input autocomplete="off" v-query="update" type="text" name="search" id="search" class="focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="Search">
      </div>
    </div>

    <jet-select v-if="trashed" :options="trashOptions" empty="Not Trashed" v-query="update" />

    <jet-select :options="sortOptions" empty="Sort" v-query="update" />
  </div>
</template>

<script>
import JetInput from '@/Jetstream/Input'
import { JetSelect } from '@jetstreamkit/components'
import Connect from '../Mixins/Connect';

export default {
  props: {
    sort: Array,
    trashed: Boolean
  },
  mixins: [
    Connect
  ],
  components: {
    JetInput,
    JetSelect,
  },
  methods: {
    update(payload) {
      this.connectChanged('updateQuery', payload)
    },
    displayFormat(item)  {
      return item
          .replace('_', ' ')
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')
    }
  },
  computed: {
    trashOptions() {
      return [
        {
          name: 'with-deleted',
          value: 'true',
          display: 'With Trashed'
        },
        {
          name: 'deleted',
          value: 'true',
          display: 'Only Trashed'
        }
      ]
    },
    sortOptions() {
      if(!this.sort) {
        return [];
      }

      let options = []

      this.sort.forEach(item => {
        if(item instanceof Object) {
          options.push(item)
        } else {
          options.push({
            name: 'sort',
            value: item,
            display: this.displayFormat(item) + ' (asc)'
          })

          options.push({
            name: 'sort-desc',
            value: item,
            display: this.displayFormat(item) + ' (desc)'
          })
        }
      })

      return options;
    }
  }
}
</script>
