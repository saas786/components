<template>
    <select v-bind="$attrs" class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm">
        <option value="" v-if="empty">{{ empty }}</option>
        <option v-for="option in formattedOptions" :value="option.value" :data-name="option.name">
            {{ option.display }}
        </option>
    </select>
</template>
<script>

export default {
  props: {
      empty: String,
      options: {
          default: [],
          type: [Object, Array]
      },
      default: String,
  },
    computed: {
      formattedOptions() {
          if(Array.isArray(this.options)
              && this.options.length
              && typeof this.options[0] === 'object') {
              return this.options;
          }

          let options = []

          if(Array.isArray(this.options)
              && this.options.length
              && this.options[0] !== 'object') {
              this.options.forEach(option => {
                  options.push({display: option, value: option})
              })
              return options;
          }

          Object.keys(this.options).forEach(key => {
              options.push({display: this.options[key], value: key})
          })

          return options;
      }
    }
};
</script>
