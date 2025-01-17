import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { BrowserRouter as Router } from 'react-router-dom';

import { getAllOrganizations } from 'mocks/Organization';
import { setUserSession } from 'services/AuthService';
import { AdminContactManagement } from './AdminContactManagement';

const mocks = getAllOrganizations;

setUserSession(JSON.stringify({ roles: [{ label: 'Admin' }], organization: { id: '1' } }));

const contactManagement = (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Router>
      <AdminContactManagement />
    </Router>
  </MockedProvider>
);

test('Admin contact management form renders correctly', async () => {
  render(contactManagement);
  const helpText = await screen.getByText(
    'You can move contacts to collections in bulk or update their contact information. Please create csv file that exactly matches the sample. Here are the'
  );
  expect(helpText).toBeInTheDocument();
});

test('the page should have a disabled upload button by default', async () => {
  render(contactManagement);

  const uploadButton = await screen.getByTestId('uploadButton');
  expect(uploadButton).toBeInTheDocument();
  expect(uploadButton).toHaveAttribute('disabled');
});
