import { render } from '@testing-library/react';

import Header from '../components/Header';

describe('<Header />', () => {
  it('renders the title and not the subtitle when subtitle is not provided', () => {
    const { getByText, queryByText } = render(<Header title="Test Title" />);

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('renders both title and subtitle when subtitle is provided', () => {
    const { getByText } = render(<Header title="Test Title" subtitle="Test Subtitle" />);

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Subtitle')).toBeInTheDocument();
  });
});
