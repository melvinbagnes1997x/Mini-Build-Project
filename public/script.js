// Global variables
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let currentPage = 1;
let currentFilter = 'all';
let currentSort = 'default';
let currentSearch = '';
let currentPriority = '';
let currentDueDateRange = '';

// API Configuration - Dynamic for production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : `${window.location.protocol}//${window.location.hostname}/api`;

// DOM Elements
let authSection, dashboardSection, loadingSpinner, notificationContainer;
let loginForm, registerForm, logoutBtn, userInfo;
let addTaskForm, taskList, pagination;
let searchInput, filterButtons, sortSelect, priorityFilter;
let statsElements;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    setupEventListeners();
    checkAuthenticationStatus();
});

function initializeDOMElements() {
    // Authentication elements
    authSection = document.getElementById('authSection');
    dashboardSection = document.getElementById('dashboardSection');
    loadingSpinner = document.getElementById('loadingSpinner');
    notificationContainer = document.getElementById('notificationContainer');
    
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    logoutBtn = document.getElementById('logoutBtn');
    userInfo = document.getElementById('userInfo');
    
    // Dashboard elements
    addTaskForm = document.getElementById('addTaskForm');
    taskList = document.getElementById('taskList');
    pagination = document.getElementById('pagination');
    
    // Control elements
    searchInput = document.getElementById('searchInput');
    filterButtons = document.querySelectorAll('.filter-btn');
    sortSelect = document.getElementById('sortTasks');
    priorityFilter = document.getElementById('priorityFilter');
    
    // Stats elements
    statsElements = {
        total: document.getElementById('totalTasks'),
        completed: document.getElementById('completedTasks'),
        active: document.getElementById('activeTasks'),
        overdue: document.getElementById('overdueTasks')
    };
}

function setupEventListeners() {
    // Authentication events
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Form switching
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });
    
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
    
    // Task form
    addTaskForm.addEventListener('submit', handleAddTask);
    
    // Search and filters
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    filterButtons.forEach(btn => btn.addEventListener('click', handleFilter));
    sortSelect.addEventListener('change', handleSort);
    priorityFilter.addEventListener('change', handlePriorityFilter);
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

// Authentication Functions
async function checkAuthenticationStatus() {
    if (authToken) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                showDashboard();
                await Promise.all([fetchTasks(), fetchStats()]);
            } else {
                localStorage.removeItem('authToken');
                showAuth();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            showAuth();
        }
    } else {
        showAuth();
    }
}

async function handleLogin(event) {
    event.preventDefault();
    showLoading();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            
            showNotification('Login successful!', 'success');
            showDashboard();
            await Promise.all([fetchTasks(), fetchStats()]);
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(event) {
    event.preventDefault();
    showLoading();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            
            showNotification('Registration successful!', 'success');
            showDashboard();
            await Promise.all([fetchTasks(), fetchStats()]);
        } else {
            showNotification(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    showAuth();
    showNotification('Logged out successfully', 'info');
}

function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    
    if (currentUser) {
        userInfo.textContent = `Welcome, ${currentUser.username} (${currentUser.role})`;
    }
}

function showLoginForm() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showRegisterForm() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

// Task Management Functions
async function fetchTasks() {
    if (!authToken) return;
    
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 10
        });
        
        if (currentFilter !== 'all') {
            if (currentFilter === 'overdue') {
                params.append('dueDateRange', 'overdue');
            } else {
                params.append('filter', currentFilter);
            }
        }
        
        if (currentSort !== 'default') {
            params.append('sort', currentSort);
        }
        
        if (currentSearch) {
            params.append('search', currentSearch);
        }
        
        if (currentPriority) {
            params.append('priority', currentPriority);
        }
        
        const response = await fetch(`${API_BASE_URL}/tasks?${params}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            displayTasks(data.tasks);
            updatePagination(data.pagination);
        } else {
            showNotification('Failed to fetch tasks', 'error');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showNotification('Failed to fetch tasks', 'error');
    }
}

function displayTasks(tasks) {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="no-tasks">No tasks found</div>';
        return;
    }
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskDiv.dataset.taskId = task._id;
    
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    taskDiv.innerHTML = `
        <div class="task-content">
            <h3>${escapeHtml(task.title)}</h3>
            ${task.description ? `<p>${escapeHtml(task.description)}</p>` : ''}
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                ${task.dueDate ? `<span><i class="fas fa-calendar"></i> Due: ${formatDate(task.dueDate)}</span>` : ''}
                <span><i class="fas fa-clock"></i> Created: ${formatDate(task.createdAt)}</span>
                ${isOverdue ? '<span class="overdue-warning"><i class="fas fa-exclamation-triangle"></i> Overdue</span>' : ''}
            </div>
        </div>
        <div class="task-actions">
            <button class="complete-btn" onclick="toggleTaskCompletion('${task._id}', ${!task.completed})">
                ${task.completed ? '<i class="fas fa-undo"></i> Undo' : '<i class="fas fa-check"></i> Complete'}
            </button>
            <button class="edit-btn" onclick="editTask('${task._id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteTask('${task._id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return taskDiv;
}

async function handleAddTask(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitleInput').value.trim();
    const description = document.getElementById('taskDescriptionInput').value.trim();
    const dueDate = document.getElementById('taskDueDateInput').value;
    const priority = document.getElementById('taskPriorityInput').value;
    
    if (!title) {
        showNotification('Task title is required', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title,
                description,
                dueDate: dueDate || null,
                priority
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Task added successfully!', 'success');
            addTaskForm.reset();
            await Promise.all([fetchTasks(), fetchStats()]);
        } else {
            showNotification(data.message || 'Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Failed to add task', 'error');
    }
}

async function toggleTaskCompletion(taskId, completed) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            showNotification(`Task ${completed ? 'completed' : 'marked as active'}!`, 'success');
            await Promise.all([fetchTasks(), fetchStats()]);
        } else {
            showNotification('Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Failed to update task', 'error');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Task deleted successfully!', 'success');
            await Promise.all([fetchTasks(), fetchStats()]);
        } else {
            showNotification('Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// Filter and Search Functions
function handleSearch() {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    fetchTasks();
}

function handleFilter(event) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentFilter = event.target.id.replace('filter', '').toLowerCase();
    currentPage = 1;
    fetchTasks();
}

function handleSort(event) {
    currentSort = event.target.value;
    fetchTasks();
}

function handlePriorityFilter(event) {
    currentPriority = event.target.value;
    currentPage = 1;
    fetchTasks();
}

// Pagination Functions
function updatePagination(paginationData) {
    if (paginationData.totalPages <= 1) {
        pagination.classList.add('hidden');
        return;
    }
    
    pagination.classList.remove('hidden');
    document.getElementById('pageInfo').textContent = 
        `Page ${paginationData.currentPage} of ${paginationData.totalPages} (${paginationData.totalTasks} tasks)`;
    
    document.getElementById('prevPage').disabled = !paginationData.hasPrevPage;
    document.getElementById('nextPage').disabled = !paginationData.hasNextPage;
}

function changePage(delta) {
    currentPage += delta;
    fetchTasks();
}

// Stats Functions
async function fetchStats() {
    if (!authToken) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            updateStats(stats);
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function updateStats(stats) {
    statsElements.total.textContent = stats.total;
    statsElements.completed.textContent = stats.completed;
    statsElements.active.textContent = stats.active;
    statsElements.overdue.textContent = stats.overdue;
}

// Utility Functions
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-header">
            <span class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Placeholder functions for future enhancements
function editTask(taskId) {
    showNotification('Edit functionality coming soon!', 'info');
}

// Add some CSS for missing elements
const additionalStyles = `
    .no-tasks {
        text-align: center;
        padding: 40px;
        color: #666;
        font-style: italic;
    }
    
    .overdue-warning {
        color: #dc3545;
        font-weight: 600;
    }
    
    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
