describe('Task Manager E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('should register a new user', () => {
    cy.get('#showRegister').click()
    cy.get('#registerUsername').type('testuser')
    cy.get('#registerEmail').type('test@example.com')
    cy.get('#registerPassword').type('password123')
    cy.get('#registerForm').submit()
    
    // Should show dashboard after successful registration
    cy.get('#dashboardSection').should('not.have.class', 'hidden')
    cy.get('#userInfo').should('contain', 'testuser')
  })

  it('should login existing user', () => {
    cy.get('#loginEmail').type('test@example.com')
    cy.get('#loginPassword').type('password123')
    cy.get('#loginForm').submit()
    
    cy.get('#dashboardSection').should('not.have.class', 'hidden')
  })

  it('should create a new task', () => {
    // Login first
    cy.get('#loginEmail').type('test@example.com')
    cy.get('#loginPassword').type('password123')
    cy.get('#loginForm').submit()
    
    // Create task
    cy.get('#taskTitleInput').type('Test Task')
    cy.get('#taskDescriptionInput').type('This is a test task')
    cy.get('#taskDueDateInput').type('2024-12-31')
    cy.get('#taskPriorityInput').select('high')
    cy.get('#addTaskForm').submit()
    
    // Verify task appears
    cy.get('.task-item').should('contain', 'Test Task')
    cy.get('.task-item').should('contain', 'high')
  })

  it('should filter tasks by status', () => {
    // Login first
    cy.get('#loginEmail').type('test@example.com')
    cy.get('#loginPassword').type('password123')
    cy.get('#loginForm').submit()
    
    // Filter by active tasks
    cy.get('#filterActive').click()
    cy.get('#filterActive').should('have.class', 'active')
  })

  it('should search tasks', () => {
    // Login first
    cy.get('#loginEmail').type('test@example.com')
    cy.get('#loginPassword').type('password123')
    cy.get('#loginForm').submit()
    
    // Search for a task
    cy.get('#searchInput').type('Test Task')
    cy.get('.task-item').should('contain', 'Test Task')
  })

  it('should logout user', () => {
    // Login first
    cy.get('#loginEmail').type('test@example.com')
    cy.get('#loginPassword').type('password123')
    cy.get('#loginForm').submit()
    
    // Logout
    cy.get('#logoutBtn').click()
    cy.get('#authSection').should('not.have.class', 'hidden')
  })
}) 