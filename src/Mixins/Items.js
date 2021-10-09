import JetPagination from '../Items/Pagination';
import JetEmpty from '../Items/Empty';

export default {
    components: {
        JetPagination,
        JetEmpty,
    },
    props: {
        url: String,
        cells: Array,
        data: Object,
        click: [String, Function],
        wrapperClass: String,
        itemClass: String,
        itemKey: {
            type: String,
            default: 'id'
        }
    },
    watch: {
        data: {
            deep: true,
            immediate: true,
            handler(data) {
                if(!data) return;

                this.items = data.data === undefined
                    ? { data }
                    : data;
            }
        },
    },
    mounted() {
        if(this.url) {
            this.get(this.url)
        }
    },
    data() {
        return {
            items: [],
        };
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
        ajax() {
            return this.url != null;
        },
        cursorWhenClickable() {
            if(this.click) {
                return ' cursor-pointer';
            }
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
        get(url) {
            axios.get(url, {
                headers: { 'Content-Type': 'application/json' },
            }).then((response) => {
                this.items = response.data;
            });
        },
    },
};