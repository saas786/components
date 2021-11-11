<template>
  <div>
    <span v-for="item in items">{{ item[display] }}</span>
    <input type="text" @keydown.enter="add" />
    <div v-if="similarItems">
      <div v-for="option in options">
        {{ option[display] }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['display'],
  data() {
    return {
      items: [],
      options: [],
    };
  },
  computed: {
    similarItems() {
      return true; // check current typed against options
    },
  },
  mounted() {
    axios.get('/options').then((response) => {
      this.options = response.data;
    });
  },
  methods: {
    add(event) {
      //
    },
  },
};
</script>
