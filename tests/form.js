import { mount } from '@vue/test-utils'
import { JetForm } from '../index';

test('displays message', () => {
    const form = mount(JetForm, {
        props: {
            fields: ['title', 'description']
        }
    })

    expect(form.html()).toContain('<label for="title">Title</label>')
    expect(form.html()).toContain('<label for="description">Description</label>')
})
