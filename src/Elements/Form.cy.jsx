import Form from './Form.vue'

describe('Form Setup', () => {

    it('renders form element with attributes', () => {
        cy.mount(<Form />, {
            props: {
                method: 'POST',
                action: '/users/new',
            }
        })

        cy.get('form')
            .invoke('attr', 'action')
            .should('eq', '/users/new')

        cy.get('form')
            .invoke('attr', 'method')
            .should('eq', 'POST')
    })
})

describe('Form Fields', () => {

    it('with a flat array of field names', () => {
        cy.mount(<Form />, {
            props: {
                action: '/users/new',
                fields: ['title', 'description']
            }
        })

        cy.get('form input').should('have.length', 2)
        cy.get('label[for="title"]').should('contain.text', 'Title')
        cy.get('label[for="description"]').should('contain.text', 'Description')
        cy.get('input[name="title"]').should('exist').should('not.have.value')
        cy.get('input[name="description"]').should('exist').should('not.have.value')
    })

    it('with values when passed a values object', () => {
        cy.mount(<Form />, {
            props: {
                fields: ['title', 'description'],
                values: {title: 'Titanic', description: 'row row row your boat'}
            }
        })

        cy.get('input[name="title"]').should('have.value', 'Titanic')
        cy.get('input[name="description"]').should('have.value', 'row row row your boat')
    })

    it('with a values object only', () => {
        cy.mount(<Form />, {
            props: {
                values: {title: 'Titanic', description: 'row row row your boat'}
            }
        })

        cy.get('input[name="title"]').should('have.value', 'Titanic')
        cy.get('input[name="description"]').should('have.value', 'row row row your boat')
    })

    it('with a values object and excludes', () => {
        cy.mount(<Form />, {
            props: {
                action: '/users/new',
                exclude: ['description'],
                values: {title: 'Titanic', description: 'row row row your boat'}
            }
        })

        cy.get('input[name="title"]').should('have.value', 'Titanic')
        cy.get('input[name="description"]').should('not.exist')
    })

    it('with an object', () => {
        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title' },
                    { name: 'description' },
                ]
            }
        })

        cy.get('label[for="title"]').should('contain.text', 'Title')
        cy.get('label[for="description"]').should('contain.text', 'Description')
        cy.get('input[name="title"]').should('exist')
        cy.get('input[name="description"]').should('exist')
    })

    it('with an object & default value', () => {
        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title', value: 'Titanic' },
                    { name: 'description' },
                ]
            }
        })

        cy.get('input[name="title"]').should('have.value', 'Titanic')
        cy.get('input[name="description"]').should('not.have.value')
    })

    it('with an object & width span', () => {
        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title', span: 6 },
                    { name: 'description', span: 3 },
                    { name: 'author_id' }
                ]
            }
        })

        cy.get('[data-testid="field-title"]').should('have.class', 'col-span-6')
        cy.get('[data-testid="field-description"]').should('have.class', 'col-span-3')
        cy.get('[data-testid="field-author_id"]').should('have.class', 'col-span-12')
    })
})

describe('Form Field Extras', () => {

    it('with a divider', () => {

        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title' },
                    { divider: true },
                    { name: 'description' },
                ]
            }
        })

        cy.get('[data-testid="field-title"]')
            .siblings('[data-testid="field-divider"]')
            .should('have.length', 1)

        cy.get('[data-testid="field-divider"]')
            .siblings('[data-testid="field-description"]')
            .should('have.length', 1)
    })

    it('with a section titles', () => {

        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title' },
                    { section_title: 'Some title' },
                    { name: 'description' },
                ]
            }
        })

        cy.get('[data-testid="field-title"]')
            .siblings('[data-testid="field-section_title"]')
            .should('have.length', 1)
            .should('have.text', 'Some title')

        cy.get('[data-testid="field-section_title"]')
            .siblings('[data-testid="field-description"]')
            .should('have.length', 1)
    })
})

describe('Form Field Slots', () => {
    it.skip('overrides entire field block via slot', () => {

        // period in slot name is breaking: unknown: Unexpected token
        // also can we use slot shorthand? #field.title.all="" ?

        // cy.mount(() => (
        //     <Form>
        //         <template v-slot:field.title.all="{ form }">
        //             <span id="test_output" v-text="form.title" />
        //             <input name="title" v-model="form.title" />
        //         </template>
        //     </Form>
        // ), {
        //     props: {
        //         fields: ['title', 'description']
        //     }
        // });

        cy.get('form input').should('have.length', 2)
        cy.get('label[for="title"]').should('not.exist')
        cy.get('label[for="description"]').should('contain.text', 'Description')
        cy.get('input[name="title"]').should('exist').should('not.have.value')
        cy.get('input[name="description"]').should('exist').should('not.have.value')
        cy.get('input[name="title"]').type('hello world')
        cy.get('span#test_output').should('have.text', 'hello world')
    })

    it.skip('overrides a field block input and keep label & error', () => {

        // period in slot name is breaking: unknown: Unexpected token

        // cy.mount(() => (
        //     <Form>
        //         <template v-slot:field.title="{ form }">
        //             <span id="test_output" v-text="form.title" />
        //             <input name="title" v-model="form.title" />
        //         </template>
        //     </Form>
        // ), {
        //     props: {
        //         fields: ['title', 'description']
        //     }
        // });

        cy.get('form input').should('have.length', 2)
        cy.get('label[for="title"]').should('contain.text', 'Title')
        cy.get('label[for="description"]').should('contain.text', 'Description')
        cy.get('input[name="title"]').type('hello world')
        cy.get('span#test_output').should('have.text', 'hello world')
    })
})

describe('Form Buttons', () => {

    it('submit button is "create" by default', () => {
        cy.mount(<Form />)

        cy.get('button[type="submit"]').should('have.text', 'Create')
    })

    it('submit button is "update" when passed values', () => {
        cy.mount(<Form />, {
            props: {
                fields: ['title'],
                values: {title: 'Hello'}
            }
        })

        cy.get('button[type="submit"]').should('have.text', 'Update')
    })

    it('cancel button does not exist by default', () => {
        cy.mount(<Form />, {
            props: {
                fields: ['title'],
                values: {title: 'Hello'}
            }
        })

        cy.get('button[data-testid="cancel"]').should('not.exist')
    })

    it.skip('cancel button exists when form has cancel listener', () => {

        // the cancel handler should add onCancel to $attrs which displays button

        cy.mount(<Form />, {
            listeners: {
                cancel: () => {}
            }
        })

        cy.get('button[data-testid="cancel"]').should('exist')
    })
})

describe('Form Submit', () => {
    it.skip('renders success message at the top', () => {})
    it.skip('renders error message at the top', () => {})
    it.skip('renders single error message for field', () => {
        cy.intercept('POST', '/users/new', {
            fixture: 'inertia-error-new-user',
            statusCode: 422,
            headers: {
                'Vary': 'Accept',
                'X-Inertia': 'true',
            }
        }).as('formSubmit')

        cy.mount(<Form />, {
            props: {
                action: '/users/new',
                fields: ['title', 'description'],
                formHandler: {
                    processing: false,
                    submit() {
                      //
                    },
                    reset() {
                        //
                    }
                }
            }
        })

        cy.get('button[type="submit"]').click()

        cy.wait('@formSubmit').then((interception) => {
            cy.get('div[data-testid="error"]').should('have.length', 1)
            cy.get('div[data-testid="error"]').first().should('have.text', 'The title field is required.')
        })
    })
})
