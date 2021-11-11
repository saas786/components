export default {
  inject: ['config'],

  props: {
    parent: Object,
  },
  methods: {
    getRoute(name, resource) {
      let params = [];

      if (this.parent !== undefined) {
        if (typeof this.parent === 'object') {
          params.push(this.parent.id);
        } else {
          params.push(this.parent);
        }
      }

      if (resource !== undefined) {
        if (typeof resource === 'object') {
          params.push(resource.id);
        } else {
          params.push(resource);
        }
      }

      if (this.config.has('route_name_prefix')) {
        return route(
          this.config.get('route_name_prefix') + this.resource + '.' + name,
          params
        );
      }

      return route(this.resource + '.' + name, params);
    },
  },
};
