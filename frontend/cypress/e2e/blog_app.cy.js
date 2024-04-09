describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = {
      name: 'root',
      username: 'root',
      password: 'secret',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[placeholder="Username"]').type('root')
      cy.get('[placeholder="Password"]').type('secret')
      cy.contains('button', 'Login').click()
      cy.contains('Login successful')
    })

    it('fails with wrong credentials', function () {
      cy.get('[placeholder="Username"]').type('root')
      cy.get('[placeholder="Password"]').type('wrong')
      cy.contains('button', 'Login').click()

      cy.contains('Wrong username or password')
    })
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'secret' })
      cy.visit('')
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('input[placeholder="Title"]').type('New')
      cy.get('input[placeholder="Author"]').type('root')
      cy.get('input[placeholder="Url"]').type('url.com')
      cy.contains('button', 'Create').click()

      cy.contains('New by root added')
    })

    describe('and several blog exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'blog 1',
          author: 'author A',
          url: 'url I',
          likes: 10,
        })
        cy.createBlog({
          title: 'blog 2',
          author: 'author B',
          url: 'url II',
          likes: 30,
        })
        cy.createBlog({
          title: 'blog 3',
          author: 'author C',
          url: 'url III',
          likes: 20,
        })
        cy.visit('')
      })

      it('user can like a blog', function () {
        cy.contains('blog 1').click()

        cy.contains('10')

        cy.contains('like').click()

        cy.contains('11')
      })

      it('user who creates can a blog can delete it', function () {
        cy.contains('blog 1').click()

        cy.contains('delete').click()

        cy.visit('')
        cy.contains('blog 1 author A').should('not.exist')
      })

      it('only the create of a blog can delete it', function () {
        cy.contains('logout').click()
        cy.contains('blog 1').click()

        cy.contains('delete').should('not.exist')
      })
    })
  })
})
