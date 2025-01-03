import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../router/Home';
import RenderContext from '../context/RenderContext';

// Mock the fetch API globally
global.fetch = jest.fn();

describe('Home Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid interference
  });

  test('fetches boards and renders them correctly', async () => {
    // Mock API response for boards
    const mockBoards = {
      data: [
        {
          id: 1,
          title: 'Board 1',
          stages: [
            { stageId: 1, title: 'To-Do', items: [{ id: 101, name: 'Task 1' }] },
            { stageId: 2, title: 'In Progress', items: [{ id: 102, name: 'Task 2' }] },
          ],
        },
        {
          id: 2,
          title: 'Board 2',
          stages: [
            { stageId: 3, title: 'Done', items: [{ id: 103, name: 'Task 3' }] },
          ],
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockBoards,
    });

    // Render the Home component with a mock RenderContext
    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <Home />
      </RenderContext.Provider>
    );

    // Wait for fetch to complete and ensure boards are rendered
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/boards', { method: 'GET' });
      expect(screen.getByText('Board 1')).toBeInTheDocument();
      expect(screen.getByText('Board 2')).toBeInTheDocument();
      expect(screen.getByText('To-Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    // Verify tasks are displayed within the stages
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('displays an error message if fetch fails', async () => {
    // Mock a failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <Home />
      </RenderContext.Provider>
    );

    // Wait for fetch call to complete and check for console log
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/boards', { method: 'GET' });
    });

    // Simulate the expected behavior when fetch fails
    // In your component, you can display an error message if desired
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error fetching boards:')
    );
  });

  test('renders an empty board list when no data is returned', async () => {
    // Mock an API response with no boards
    const mockEmptyBoards = { data: [] };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockEmptyBoards,
    });

    render(
      <RenderContext.Provider value={[false, jest.fn()]}>
        <Home />
      </RenderContext.Provider>
    );

    // Wait for fetch to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('api/v1/boards', { method: 'GET' });
    });

    // Verify that no boards are rendered
    expect(screen.queryByText('Board 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Board 2')).not.toBeInTheDocument();
  });
});
