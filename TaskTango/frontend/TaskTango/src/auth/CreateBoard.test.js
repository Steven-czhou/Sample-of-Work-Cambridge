import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CreateBoard from './CreateBoard';
import { RenderProvider } from '../context/RenderContext';

global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({ message: "success" }),
  })
);

describe('CreateBoard Component', () => {
  it('renders the Create Board button', () => {
    render(
      <RenderProvider><CreateBoard /></RenderProvider>
    );
    const createButton = screen.getByText('Create Board');
    expect(createButton).toBeInTheDocument();
  });

  it('opens the dialog when Create Board button is clicked', () => {
    render(
      <RenderProvider><CreateBoard /></RenderProvider>
    );
    const createButton = screen.getByText('Create Board');
    fireEvent.click(createButton);
    const dialogTitle = screen.getByText('Create a new board');
    expect(dialogTitle).toBeInTheDocument();
  });

  it('updates the title input field', () => {
    render(
      <RenderProvider><CreateBoard /></RenderProvider>
    );
    const createButton = screen.getByText('Create Board');
    fireEvent.click(createButton);

    const inputField = screen.getByLabelText('Title');
    fireEvent.change(inputField, { target: { value: 'Test Title' } });
    expect(inputField.value).toBe('Test Title');
  });

  it('calls handleSubmit when Submit button is clicked', async () => {
    render(
      <RenderProvider><CreateBoard /></RenderProvider>
    );
    const createButton = screen.getByText('Create Board');
    fireEvent.click(createButton);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await act( async() => {
      expect(fetch).toHaveBeenCalledWith('/api/v1/boards', {
        method: 'POST',
        credentials: 'include',
        body: "{\"title\":\"\"}",
        headers: {
          "Content-Type": "application/json"
        }
      });
    });
  });
});

