import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import InProgress from '../router/InProgress';
import RenderContext from '../context/RenderContext';

// Mock the fetch API globally
global.fetch = jest.fn();

describe('InProgress Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  test('fetches tasks and filters them by stageId 2', async () => {
    // Mock API response for tasks
    const mockTasks = {
      data: [
        { id: 1, name: 'Task 1', stageId: 2 },
        { id: 2, name: 'Task 2', stageId: 3 },
        { id: 3, name: 'Task 3', stageId: 2 },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockTasks,
    });

    // Render the InProgress component with mock RenderContext
    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <InProgress />
      </RenderContext.Provider>
    );

    // Wait for fetch to complete and ensure tasks are rendered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
      expect(screen.getByText('InProgress List')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    // Ensure tasks not in stageId 2 are not rendered
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
        <InProgress />
      </RenderContext.Provider>
    );

    // Wait for fetch call to complete and verify error logging
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/tasks', { method: 'GET' });
    });

    // Since the component doesn't display an error message, we check the console.error
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching boards:')
    );

    // Check that the "No tasks available" message is displayed
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
        <InProgress />
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
