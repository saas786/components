export default {
    methods: {
        can(permission) {
            return (
                this.$page.props.permissions &&
                this.$page.props.permissions.includes(permission)
            );
        },
        cannot(permission) {
            return !this.can(permission);
        },
    },
};
