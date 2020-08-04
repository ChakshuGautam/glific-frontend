import React, { useState } from 'react';
import { Input } from '../../components/UI/Form/Input/Input';
import { GET_USERS_QUERY } from '../../graphql/queries/StaffManagement';
import { UPDATE_USER, DELETE_USER } from '../../graphql/mutations/StaffManagement';
import { CREATE_TEMPLATE } from '../../graphql/mutations/Template';
import { ReactComponent as StaffManagementIcon } from '../../assets/images/icons/StaffManagement/Active.svg';
import { ListItem } from '../List/ListItem/ListItem';

export interface StaffManagementProps {
  match: any;
}

const setValidation = (values: any) => {
  const errors: Partial<any> = {};
  if (!values.name) {
    errors.name = 'User title required';
  } else if (values.name.length > 50) {
    errors.name = 'Length of the title is too long';
  }
  if (!values.phone) {
    errors.phone = 'User phone required';
  }
  return errors;
};

const dialogMessage = ' Once deleted this action cannot be undone.';

const formFields = [
  { component: Input, name: 'name', type: 'text', placeholder: 'Full Name', query: true },
  { component: Input, name: 'phone', disabled: true, placeholder: 'Phone Number', query: false },
  {
    component: Input,
    name: 'roles',
    disabled: true,
    type: 'text',
    placeholder: 'Roles',
    query: true,
  },
];

const staffManagementIcon = <StaffManagementIcon />;

const queries = {
  getItemQuery: GET_USERS_QUERY,
  createItemQuery: CREATE_TEMPLATE,
  updateItemQuery: UPDATE_USER,
  deleteItemQuery: DELETE_USER,
};

export const StaffManagement: React.SFC<StaffManagementProps> = ({ match }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roles, setRoles] = useState('');

  const states = { name, phone, roles };
  const setStates = ({ name, phone, roles }: any) => {
    setName(name);
    setPhone(phone);
    setRoles(roles);
  };

  return (
    <ListItem
      {...queries}
      match={match}
      states={states}
      setStates={setStates}
      setValidation={setValidation}
      listItemName="User"
      dialogMessage={dialogMessage}
      formFields={formFields}
      redirectionLink="staff-management"
      listItem="user"
      icon={staffManagementIcon}
      languageSupport={false}
      checkItemsHeader="Groups"
    />
  );
};