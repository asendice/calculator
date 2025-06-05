import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator', () => {
  render(<App />);
  // Check if a button with text "7" is present
  const buttonElement = screen.getByText('7');
  expect(buttonElement).toBeInTheDocument();
});
