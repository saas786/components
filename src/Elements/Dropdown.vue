<template>
  <div class="relative" v-click-outside="close">
    <div @click="toggle" ref="trigger">
      <slot name="trigger"></slot>
    </div>

    <teleport to="body">
      <div v-show="open" class="absolute top-0 left-0">
        <div
          ref="content"
          class="relative mt-1 rounded-md shadow-lg"
          :style="{ top: top + 'px', left: left + 'px', width: width + 'px' }"
        >
          <div
            @click.stop
            class="bg-white rounded-md ring-1 ring-black ring-opacity-5"
          >
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 240,
    },
  },
  data() {
    return {
      open: false,
      top: 0,
      left: 0,
    };
  },
  methods: {
    toggle() {
      let trigger = this.$refs.trigger.getBoundingClientRect();
      this.top = trigger.top + trigger.height;
      this.left = trigger.left - this.width + trigger.width;
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
  },
};
</script>
