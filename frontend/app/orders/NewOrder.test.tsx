import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
//import '@testing-library/jest-dom/extend-expect';
import NewOrderForm from './NewOrder';
import fetchMock from 'fetch-mock';
import { toast } from 'sonner';

// Mock the useProducts hook
jest.mock('../../lib/hooks/useProduct', () => () => ({
  products: [
    { id: 1, name: 'Product 1', quantity: 10 },
    { id: 2, name: 'Product 2', quantity: 5 }
  ]
}));

// Mock the toast library
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('NewOrderForm', () => {
  afterEach(() => {
    fetchMock.restore();
    jest.clearAllMocks();
  });

  test('renders NewOrderForm and interacts with it', async () => {
    const mockOnSubmit = jest.fn();
    render(<NewOrderForm onSubmit={mockOnSubmit} />);

    // Open the dialog
    fireEvent.click(screen.getByText(/Add New Order/i));

    // Select a product
    const product1Checkbox = screen.getByLabelText('Product 1');
    fireEvent.click(product1Checkbox);
    expect(product1Checkbox).toBeChecked();

    // Change the quantity
    const quantityInput = screen.getByLabelText('Product 1').nextElementSibling;
    fireEvent.change(quantityInput, { target: { value: '3' } });
    expect(quantityInput).toHaveValue(3);

    // Mock fetch response
    fetchMock.put('/inventory_api/orders', {
      status: 200,
      body: {}
    });

    // Submit the form
    const createOrderButton = screen.getByText(/Create Order/i);
    fireEvent.click(createOrderButton);

    await waitFor(() => {
      expect(fetchMock.called('/inventory_api/orders')).toBe(true);
      expect(toast.success).toHaveBeenCalledWith("Successfully created new order.");
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  test('handles API error on form submission', async () => {
    const mockOnSubmit = jest.fn();
    render(<NewOrderForm onSubmit={mockOnSubmit} />);

    // Open the dialog
    fireEvent.click(screen.getByText(/Add New Order/i));

    // Select a product
    const product1Checkbox = screen.getByLabelText('Product 1');
    fireEvent.click(product1Checkbox);
    expect(product1Checkbox).toBeChecked();

    // Change the quantity
    const quantityInput = screen.getByLabelText('Product 1').nextElementSibling;
    fireEvent.change(quantityInput, { target: { value: '3' } });
    expect(quantityInput).toHaveValue(3);

    // Mock fetch response with error
    fetchMock.put('/inventory_api/orders', {
      status: 400,
      body: {}
    });

    // Submit the form
    const createOrderButton = screen.getByText(/Create Order/i);
    fireEvent.click(createOrderButton);

    await waitFor(() => {
      expect(fetchMock.called('/inventory_api/orders')).toBe(true);
      expect(toast.error).toHaveBeenCalledWith("Failed to create new order.");
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
