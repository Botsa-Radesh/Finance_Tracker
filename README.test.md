# Testing Documentation

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Structure

### Unit Tests
Located in `src/**/__tests__/` directories:
- `useAuth.test.tsx` - Authentication hook tests
- `IncomeManager.test.tsx` - Income management component tests
- `BudgetManager.test.tsx` - Budget management component tests
- `ExpenseTracker.test.tsx` - Expense tracking component tests
- `utils.test.ts` - Utility function tests

### Integration Tests
Located in `src/test/__tests__/`:
- `integration.test.tsx` - Full user journey tests including:
  - Authentication flow
  - Budget and expense management
  - Multi-tab navigation
  - Data consistency

## Test Coverage

Current test coverage includes:
- ✅ Authentication flows
- ✅ Income management (CRUD operations)
- ✅ Budget management (creation, calculation, status)
- ✅ Expense tracking (add, delete, validation)
- ✅ Utility functions
- ✅ Integration flows

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Component Name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Integration Test Example
```typescript
describe('User Journey', () => {
  it('should complete full flow', async () => {
    render(<App />);
    
    // Simulate user actions
    fireEvent.click(screen.getByText('Button'));
    
    // Assert expected outcome
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

## Mocking

### Supabase Client
The Supabase client is automatically mocked in `src/test/setup.ts`.

### Custom Mocks
```typescript
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser, loading: false }),
}));
```

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Clear Test Names**: Use descriptive test names
3. **Mock External Dependencies**: Mock Supabase calls
4. **Test User Behavior**: Test from user's perspective
5. **Coverage Goals**: Aim for >80% coverage
6. **Edge Cases**: Always test edge cases and error scenarios

## Continuous Integration

Add to your CI pipeline:
```yaml
- name: Run Tests
  run: npm run test

- name: Generate Coverage
  run: npm run test:coverage
```
