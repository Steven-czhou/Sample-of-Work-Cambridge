# Research Report by Hongfei Zhang

## React Testing with Jest

### Summary of Work

I researched how to test React applications using Jest, focusing on 
creating unit tests and integration tests for React components. I followed 
tutorials and examples from the following videos:

1. [React Testing Course for Beginners – Code and Test 3 
Apps](https://www.youtube.com/watch?v=8vfQ6SWBZ-U)
2. [React Testing for Beginners: Start 
Here!](https://www.youtube.com/watch?v=8Xwq35cPwYg&t=1039s)
3. [Jest Official Documentation](https://jestjs.io/docs/getting-started)
4. [React Testing Library 
Documentation](https://testing-library.com/docs/react-testing-library/intro)

During this research, I implemented tests for basic React components, and 
learned how to verify their behavior using Jest.

---

### Motivation

Our project involves building a frontend with React. To ensure the 
stability and correctness of the application, 
it is essential to write reliable unit and integration tests. Jest is a 
powerful and widely-used testing framework for 
JavaScript and React applications, making it an ideal choice for this 
task.

---

### Time Spent

- Watching and understanding videos: ~4 hours
- Reading the document: ~3 hours
- Setting up the testing environment: ~30 minutes
- Writing this reasearch document" ~ 1 hour
- Writing and executing tests: ~3 hours

---

### Results

#### Step 1: Setting Up Jest and React Testing Library

To begin, I installed Jest and the required dependencies using the 
following command:

```bash
npm install --save-dev jest @testing-library/react 
@testing-library/jest-dom
```

Next, I ensured the `package.json` file included the test script:

```json
"scripts": {
  "test": "jest"
}
```

#### Step 2: Writing the First Test

I created a simple React component called `Button.jsx`:

```jsx
import React from 'react';

const Button = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);

export default Button;
```

Then, I wrote a test for this component in `Button.test.js`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

test('renders button and tests click event', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick} label="Click Me" />);

  // Check if button renders correctly
  const buttonElement = screen.getByText('Click Me');
  expect(buttonElement).toBeInTheDocument();

  // Simulate click event
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### Step 3: Running the Tests

I ran the tests using the following command:

```bash
npm test
```

The expected output for successful tests looked like this:

```
PASS  src/Button.test.js
  ✓ renders button and tests click event (x ms)
```

#### Step 4: Testing a Form Component

Next, I created a simple form component called `Form.jsx`:

```jsx
import React, { useState } from 'react';

const Form = () => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted: ${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter text"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
```

I then wrote a test for this component in `Form.test.js`:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

test('tests form input and submission', () => {
  render(<Form />);

  // Check if input field renders
  const inputElement = screen.getByPlaceholderText('Enter text');
  expect(inputElement).toBeInTheDocument();

  // Simulate text input
  fireEvent.change(inputElement, { target: { value: 'Test Input' } });
  expect(inputElement.value).toBe('Test Input');

  // Simulate form submission
  const buttonElement = screen.getByText('Submit');
  fireEvent.click(buttonElement);

  // Extend with alert monitoring or other submission behavior checks if 
needed
});
```

---

### Sources

- Videos:
  1. [React Testing Course for Beginners – Code and Test 3 
Apps](https://www.youtube.com/watch?v=8vfQ6SWBZ-U)
  2. [React Testing for Beginners: Start 
Here!](https://www.youtube.com/watch?v=8Xwq35cPwYg&t=1039s)
- Documentation:
  - [Jest Official Documentation](https://jestjs.io/docs/getting-started)
  - [React Testing Library 
Documentation](https://testing-library.com/docs/react-testing-library/intro)

