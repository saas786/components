<template>
  <div>
    <div v-if="data.data && data.data.length">
      <ul :class="list">
        <li
          v-for="(entry, index) in data.data"
          :key="entry.id"
          class="relative"
          :class="item"
          test="item"
          @click="visit(entry)"
        >
          <slot
            name="item"
            :index="index"
            :value="entry"
          >
            id: {{ entry.id }}
          </slot>
        </li>
      </ul>
      <jet-pagination
        :links="links"
        class="p-5 border-t"
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
      data: Object,
        click: [String, Object],
        list: String,
        item: String,
        itemKey: {
          type: String,
            default: 'id'
        }
    },
  computed: {
    links() {
      if(this.items.meta && this.items.meta.links) {
        return this.item.meta.links
      }
      if(this.items.links) {
        return this.items.links
      }

      return []
    }
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
  }
};
</script>
