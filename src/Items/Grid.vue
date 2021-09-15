<template>
  <div>
    <div v-if="data.data && data.data.length">
      <ul :class="gridClasses">
        <li
          v-for="(entry, index) in data.data"
          :key="entry.id"
          test="item"
          :class="entryClasses"
          @click="visit(entry)"
        >
          <slot name="item" :value="entry" :columns="columns" :index="index">
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
        columns: Number,
        item: String,
        itemKey: {
            type: String,
            default: 'id'
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
    },
    computed: {
      links() {
        if(this.items.meta && this.items.meta.links) {
          return this.items.meta.links
        }
        if(this.items.links) {
          return this.items.links
        }

        return []
      },
      gridClasses() {
          return 'grid grid-cols-1 sm:grid-cols-'+ this.columns +' gap-x-4 gap-y-8';
      },
        entryClasses() {

          let classes = '';

          if(this.item) {
              classes = this.item;
          }

          if(this.click) {
              classes += ' cursor-pointer';
          }

          return classes;
        }
    }
};
</script>
