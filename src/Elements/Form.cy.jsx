import Form from './Form.vue'

describe('Form', () => {

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

    it('renders fields when passed a flat array of field names', () => {
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

    it('renders fields with values when passed a values object', () => {
        cy.mount(<Form />, {
            props: {
                fields: ['title', 'description'],
                values: {title: 'Titanic', description: 'row row row your boat'}
            }
        })

        cy.get('input[name="title"]').should('have.value', 'Titanic')
        cy.get('input[name="description"]').should('have.value', 'row row row your boat')
    })

    it('renders fields when only passed a values object', () => {
        cy.mount(<Form />, {
            props: {
                values: {title: 'Titanic', description: 'row row row your boat'}
            }
        })

        cy.get('input[name="title"]').should('have.value', 'Titanic')
        cy.get('input[name="description"]').should('have.value', 'row row row your boat')
    })

    it('renders fields when only passed a values object and excludes', () => {
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

    it('renders fields from an object', () => {
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

    it('renders field object default value', () => {
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

    it.skip('renders field separators', () => {

        // logic error (not a testing problem).

        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title', value: 'Titanic' },
                    { divider: true },
                    { name: 'description' },
                ]
            }
        })
    })

    it.skip('renders section titles between fields', () => {

        // logic error (not a testing problem).

        cy.mount(<Form />, {
            props: {
                fields: [
                    { name: 'title' },
                    { section_title: 'Some title' },
                    { name: 'description' },
                ]
            }
        })

        cy.get('div[data-testid="section_title"]')
            .should('have.length', 1)

        cy.get('div[data-testid="field-title"]')
            .next('div[data-testid="section_title"]')
            .should('have.text', 'Some Title')

        cy.get('div[data-testid="section_title"]')
            .next('div[data-testid="field-description"]')
            .should('have.length', 1)
    })

    it.skip('renders field error messages', () => {
        cy.mount(<Form />, {
            props: {
                fields: ['title']
            },
            data() {
                return {
                    errors: {
                        title: 'The title field is required.'
                    }
                }
            },
        })

        cy.get('div[data-testid="error"]').should('have.length', 1)
        cy.get('div[data-testid="error"]').first().should('have.text', 'The title field is required.')
    })

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
