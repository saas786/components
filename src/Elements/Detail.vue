<template>
  <div data-testid="jet-detail" class="border-gray-200 px-4 py-5 sm:p-0">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div
        v-for="item in valuesFormatted"
        class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
      >
        <slot :name="`row.${item.key}`" :value="item.value">
          <dt :data-testid="`jet-detail-key-${item.key}`" class="capitalize text-sm font-medium text-gray-500">
            <slot :name="`item.key.${item.key}`" :value="item.value">
              {{ item.display }}
            </slot>
          </dt>
          <dd :data-testid="`jet-detail-value-${item.key}`" class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <slot :name="`value.${item.key}`" :value="item.value">
              <component
                :is="item.component"
                :key="item.key"
                :value="item.value"
                :display="item.display"
              />
            </slot>
          </dd>
        </slot>
      </div>
    </dl>
  </div>
</template>

<script>
import Config from '../Mixins/Config';
import { markRaw } from 'vue';

export default {
  mixins: [Config],
  props: {
    keys: {
      type: Array,
      default: () => [],
    },
    values: {
      type: Object,
      default: () => {},
    },
    exclude: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    valuesFormatted() {
      if (Object.keys(this.values).length === 0) {
        return {};
      }

      let output = {};

      let keys = this.keys;

      if (keys.length === 0) {
        keys = Object.keys(this.values);
      }

      if (keys.length === 0) {
        return {};
      }

      keys
        .filter((key) => !this.exclude.includes(key))
        .forEach((key) => {
          output[key] = markRaw({
            key: key,
            value: this.values[key],
            display: this.config.get(
              `values.${key}.display`,
              key.replaceAll('_', ' ')
            ),
            component: this.config.get(`values.${key}.component`, {
              props: ['key', 'value', 'display'],
              template: '{{ value }}',
            }),
          });
        });

      return output;
    },
  },
};
</script>
