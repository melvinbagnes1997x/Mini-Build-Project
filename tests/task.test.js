const Task = require('../models/task');

describe('Task Model', () => {
  it('should require a title and user', () => {
    const task = new Task();
    const error = task.validateSync();
    expect(error.errors.title).toBeDefined();
    expect(error.errors.user).toBeDefined();
  });

  it('should set default values', () => {
    const task = new Task({ title: 'Test Task', user: '507f1f77bcf86cd799439011' });
    expect(task.completed).toBe(false);
    expect(task.priority).toBe('medium');
    expect(task.isPublic).toBe(false);
  });
}); 