import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateTask from './CreateTask';
import { RenderProvider } from '../context/RenderContext';

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ message: "success" }),
  })
);

describe('CreateTask Component', () => {
  it('renders the Create Task button', () => {
    render(
      <RenderProvider><CreateTask /></RenderProvider>
    );
    const createButton = screen.getByText('Create Task');
    expect(createButton).toBeInTheDocument();
  });

  it('opens the dialog when Create Task button is clicked', () => {
    render(
      <RenderProvider><CreateTask /></RenderProvider>
    );
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);
    const dialogTitle = screen.getByText('Create a new task');
    expect(dialogTitle).toBeInTheDocument();
  });

  it('updates the input fields correctly', () => {
    render(
      <RenderProvider><CreateTask /></RenderProvider>
    );
    fireEvent.click(screen.getByText('Create Task'));

    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    expect(titleInput.value).toBe('New Task');

    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    expect(descriptionInput.value).toBe('Task description');

    const yearInput = screen.getByLabelText('Due Date Year');
    fireEvent.change(yearInput, { target: { value: '2024' } });
    expect(yearInput.value).toBe('2024');
  });

  it('calls handleSubmit and fetches data on Submit button click', async () => {
    render(
      <RenderProvider><CreateTask /></RenderProvider>
    );
    fireEvent.click(screen.getByText('Create Task'));

    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Task Title' } });

    const prioritySelect = screen.getByLabelText('Priority');
    fireEvent.mouseDown(prioritySelect);
    const priorityOption = screen.getByText('Level 1');
    fireEvent.click(priorityOption);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/v1/tasks', {
      method: 'POST',
      credentials: 'include',
      body: "{\"title\":\"Task Title\",\"description\":\"\",\"stageID\":3,\"labels\":[{\"labelId\":0,\"name\":\"Level 1\",\"color\":1}],\"dueDate\":\"2024-11-13T15:30:00\"}",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

