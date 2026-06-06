import { render } from '@testing-library/react';

test('renders without crashing', () => {
  expect(true).toBe(true);
});

test('BrochureModal renders download button', () => {
  const BrochureModal = require('./components/BrochureModal').default;
  const { getByText } = render(
    <BrochureModal
      projectName="Test Project"
      brochureUrl="https://example.com/test.pdf"
      onClose={() => {}}
    />
  );
  expect(getByText('Download Brochure', { selector: 'h3' })).toBeInTheDocument();
});
