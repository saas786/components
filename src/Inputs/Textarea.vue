<template>
    <div>
        <textarea :placeholder="placeholder" @input="grow" v-model="value" :class="{'resize-none': !resize}" class="shadow border-gray-300 rounded w-full focus:outline-none active:outline-none"></textarea>
        <slot name="footer" :length="value.length">
            <p class="text-xs py-1 text-gray-400" v-if="max > 0">{{ value.length }} / {{ max }}</p>
        </slot>
    </div>
</template>
<script>
export default {
    props: {
        resize: Boolean,
        max: {
            type: Number,
            default: 0
        },
        placeholder: {
            default: 'Type something',
        }
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        grow(event) {
            event.target.style.height = "auto";
            event.target.style.height = `${event.target.scrollHeight}px`;
        },
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.$el.setAttribute(
        //         "style",
        //         "height",
        //         `${this.$el.scrollHeight}px`
        //     );
        // });
    },
}
</script>
