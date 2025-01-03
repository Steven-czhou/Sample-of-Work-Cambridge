# Project Unified Coding Style Guide

This style guide covers coding standards and conventions for Java, JavaScript, HTML, and CSS. The goal is to ensure consistency, readability, and maintainability across different programming languages.

- **Classes**: PascalCase
  - Example: `StudentRecord`, `OrderManager`.

- **Functions/Methods**: camelCase or snake_case
  - Java/JavaScript: camelCase (e.g., `getStudentName`).

- **Variables**: camelCase or snake_case depending on the language:
  - Java/JavaScript: camelCase (e.g., `studentCount`).

- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SCORE`, `DEFAULT_TIMEOUT`).

- **HTML/CSS**:
  - HTML IDs and classes use kebab-case (e.g., `main-header`, `nav-bar`).
  - CSS class names should be semantically descriptive (e.g., `.button-primary`).

- **Indentation**: Use consistent indentation rules across all languages(not allowing tabs characters):
  - Java: 4 spaces
  - JavaScript: 2 spaces
  - HTML/CSS: 2 spaces

- **Line Length**:
  - Java/JavaScript: Limit lines to 80 characters (100 characters for Java).
  - HTML/CSS: Limit lines to 80 characters.

- **Braces and Semicolons**:
  - Java/JavaScript: Always use braces `{}` even for single-line blocks and use semicolons `;` to terminate statements.
    ```java
    if (condition) {
        doSomething();
    }
    ```

    ```javascript
    if (condition) {
        doSomething();
    }
    ```

- **Comments**:
  - Use comments to explain *why* something is done, not *what* is being done.
  - Java: Use Javadoc-style comments for methods and classes.
    ```java
    /**
     * Fetches the name of the student.
     * @return the student's name.
     */
    public String getStudentName() {
        return studentName;
    }
    ```

- **Error Handling**:
  - Java: Use specific exceptions and handle exceptions at the appropriate level.
    ```java
    try {
        // code
    } catch (IOException e) {
        // handle exception
    } finally {
        // cleanup code
    }
    ```
  - JavaScript: Use `try...catch` blocks for handling errors.
    ```javascript
    try {
        // code
    } catch (error) {
        // handle error
    } finally {
        // cleanup
    }
    ```

- **Code Organization**:
  - Java: Group related classes into packages and each class should be in its own file. Use access modifiers (`private`, `protected`, `public`) to encapsulate data.
  - JavaScript: Organize code into reusable functions and modules. Prefer `const` and `let` over `var` for variable declarations.

- **HTML**:
  - Use semantic HTML elements (`<header>`, `<footer>`, `<article>`, etc.) to improve accessibility.
  - Properly nest and indent tags. Use lowercase for all tag names and attributes. Close all self-closing tags (`<img />`, `<input />`).

- **CSS**:
  - Prefer class selectors over ID selectors for reusable styling. Use CSS variables (`--main-color`) for consistency in styling.
  - Group related CSS properties for the same element together, and use shorthand properties when appropriate (e.g., `margin: 10px 5px` instead of individual margin declarations).

- **Reference**:
  - https://google.github.io/styleguide/javaguide.html
  - https://standardjs.com/
