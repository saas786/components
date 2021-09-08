## @jetstreamkit/components

JetstreamKit vue components and mixins

### Install
Within your resources/js/app.js file:
```js
import JetstreamKit from '@jetstreamkit/components';
```

```js
createApp({
    ...
})
    .mixin({ methods: { route } })
    .use(InertiaPlugin)
    .use(JetstreamKit) <---
    .mount(el);
```