import Connect from "./Connect";

export default {
    mixins: [Connect],
    props: {
        url: String,
        cells: Array,
        data: Object,
        click: [String, Function],
        wrapperClass: String,
        itemClass: String,
        itemDisplay: {
            type: String,
            default: 'id'
        },
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
    created() {
        if(!this.url) return;

        this.currentUrl = this.url;

        this.onConnectChange('updateUrl', (url) => {
            this.currentUrl = url;
            this.get(url)
        });

        this.onConnectChange('refresh', () => {
            this.get(this.currentUrl)
        });

        this.onConnectChange('updateQuery', (payload) => {
            let existing = (new URL(this.url));
            let override = Object.fromEntries(existing.searchParams.entries());
            payload = Object.assign(payload, override)
            let queryString = new URLSearchParams(payload).toString();
            this.currentUrl = existing.pathname + '?' + queryString;
            this.get(this.currentUrl)
        });
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
