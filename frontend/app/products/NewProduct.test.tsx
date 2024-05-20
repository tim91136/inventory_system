import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewProductForm from './NewProductForm';

describe('NewProductForm', () => {
  test('renders NewProductForm component', () => {
    render(<NewProductForm suppliers={[]} onSubmit={() => {}} />);
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });
});