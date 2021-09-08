<template>
  <div class="overflow-auto">
    <div v-if="items && items.data && items.data.length > 0">
      <table
        class="whitespace-nowrap w-full"
        cellspacing="0"
        cellpadding="0"
      >
        <thead>
          <tr class="text-left font-bold border-b" test="header">
            <th
              v-for="th in cells"
              class="px-6 pt-6 pb-4"
            >
              <slot :name="`th.${th}`">
                <span class="capitalize">
                  {{ th.replace('_', ' ') }}
                </span>
              </slot>
            </th>
            <th v-if="$slots['tr.after']" />
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(item, index) in items.data"
            :key="item.id"
            test="item"
            :class="{ 'cursor-pointer hover:bg-gray-50': this.click }"
          >
            <td
              v-for="cell in cells"
              class="px-6 py-4"
              @click="visit(item)"
            >
              <slot
                :name="`td.${cell}`"
                :value="item[cell]"
                :index="index"
                :item="item"
              >
                {{ item[cell] }}
              </slot>
            </td>
            <td v-if="$slots['tr.after']">
              <div class="flex justify-end">
                <slot
                  name="tr.after"
                  :value="item"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <jet-pagination
        class="p-5 border-t"
        :links="items.links"
        :ajax="ajax"
        @clicked="get"
      />
    </div>
    <div v-else>
        <slot name="empty">
            <jet-empty />
        </slot>
    </div>
  </div>
</template>

<script>
import JetPagination from './Pagination';
import JetEmpty from './Empty';

export default {
  components: {
    JetPagination,
    JetEmpty,
  },
  props: {
    cells: Array,
    data: Object,
    click: [String, Function],
    ajax: Boolean,
    itemKey: {
        type: String,
        default: 'id'
    }
  },
  data() {
    return {
      items: [],
    };
  },
  watch: {
    data: {
        deep: true,
        immediate: true,
        handler(data) {
            this.items = data.data === undefined
                ? { data }
                : data;
        }
    },
  },
  methods: {
      visit(entry) {
          if(this.click === undefined) {
              return;
          }
          if (typeof this.click === 'string') {
              return this.$inertia.visit(
                  route(this.click, entry[this.itemKey]),
              );
          }

          this.click(entry)
      },
    get(url) {
      axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
      }).then((response) => {
        this.items = response.data;
      });
    },
  },
};
</script>
