import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ToDo from '../router/ToDo';
import RenderContext from '../context/RenderContext';

// Mock the fetch API globally
global.fetch = jest.fn();

describe('ToDo Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('fetches tasks and filters them by stageId 1', async () => {
    // Mock API response for tasks
    const mockTasks = {
      data: [
        { id: 1, name: 'Task 1', stageId: 1 },
        { id: 2, name: 'Task 2', stageId: 2 },
        { id: 3, name: 'Task 3', stageId: 1 },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockTasks,
    });

    // Render the ToDo component with mock RenderContext
    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <ToDo />
      </RenderContext.Provider>
    );

    // Wait for fetch to complete and ensure tasks are rendered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
      expect(screen.getByText('ToDo List')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    // Ensure tasks not in stageId 1 are not rendered
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  test('displays an error message if fetch fails', async () => {
    // Mock a failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <ToDo />
      </RenderContext.Provider>
    );

    // Wait for fetch call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
    });

    // Since no error message is displayed in the component, check for console.error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching boards:')
    );

    // Ensure "No tasks available" is displayed when fetch fails
    expect(screen.getByText('No tasks available.')).toBeInTheDocument();
  });

  test('renders "No tasks available" when no tasks are returned', async () => {
    // Mock API response with no tasks
    const mockEmptyTasks = { data: [] };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockEmptyTasks,
    });

    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <ToDo />
      </RenderContext.Provider>
    );

    // Wait for fetch call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
    });

    // Verify that the "No tasks available" message is displayed
    expect(screen.getByText('No tasks available.')).toBeInTheDocument();
  });
});
