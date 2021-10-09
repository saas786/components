<template>
  <div>
    <div v-if="data.data && data.data.length">
      <ul :class="wrapperClass">
        <li
          v-for="(entry, index) in data.data"
          :key="entry.id"
          class="relative"
          :class="itemClass + ' ' + cursorWhenClickable"
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
import Items from '../Mixins/Items'

export default {
  mixins: [ Items ],
}
</script>
