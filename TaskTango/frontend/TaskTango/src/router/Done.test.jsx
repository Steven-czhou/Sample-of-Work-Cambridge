import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Done from '../router/Done';
import RenderContext from '../context/RenderContext';

// Mock the fetch API
global.fetch = jest.fn();

describe('Done Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('fetches tasks and filters them by stageId', async () => {
    // Mock API response for tasks
    const mockTasks = {
      data: [
        { id: 1, name: 'Task 1', stageId: 3 },
        { id: 2, name: 'Task 2', stageId: 2 },
        { id: 3, name: 'Task 3', stageId: 3 },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockTasks,
    });

    // Render the Done component with mock RenderContext
    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <Done />
      </RenderContext.Provider>
    );

    // Wait for tasks to be fetched and rendered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
      expect(screen.getByText('Done List')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    // Ensure only tasks with stageId === 3 are displayed
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
        <Done />
      </RenderContext.Provider>
    );

    // Wait for fetch call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
    });

    // Check that "No tasks available" message is displayed
    expect(screen.getByText('No tasks available.')).toBeInTheDocument();
  });

  test('handles empty task list', async () => {
    // Mock API response with no tasks
    const mockEmptyTasks = { data: [] };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockEmptyTasks,
    });

    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <Done />
      </RenderContext.Provider>
    );

    // Wait for fetch call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
    });

    // Check that "No tasks available" message is displayed
    expect(screen.getByText('No tasks available.')).toBeInTheDocument();
  });
});
