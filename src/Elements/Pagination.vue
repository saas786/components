<template>
    <div v-if="links.length > 3" test="pagination">
        <div class="flex flex-wrap -mb-1">
            <template v-for="(link, key) in links">
                <div v-if="link.url === null" v-html="link.label" :test="link.label" class="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded" />
                <button @click="visit(link.url)" v-else :test="link.label" class="mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white hover:border-gray-500 focus:border-gray-900 focus:text-gray-900 active:border-gray-500" :class="{ 'bg-white border-gray-500 text-black': link.active }" :href="link.url" v-html="link.label" />
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        links: Array,
        ajax: Boolean,
    },

    emits: ['clicked'],

    methods: {
        visit(url) {
            if(this.ajax) {
                this.$emit('clicked', url); return;
            }

            this.$inertia.visit(url)
        }
    }
}
</script>
