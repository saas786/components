import Form from './Form.vue'

describe('Form', () => {

    it('renders', () => {
        cy.mount(<Form />, {
            props: {
                action: '/users/new',
                fields: ['title', 'description']
            }
        })

        cy.get('form input').should('have.length', 2)
    })

})
