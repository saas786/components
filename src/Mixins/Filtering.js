export default {
    methods: {
        filter(key, fallback = null) {

            let parameters = new URLSearchParams(
                window.location.search
            );

            return parameters.get(key) ?? fallback;
        }
    }
}
