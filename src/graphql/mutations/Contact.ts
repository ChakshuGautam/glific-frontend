import { gql } from '@apollo/client';

export const DELETE_CONTACT = gql`
  mutation deleteContact($id: ID!) {
    deleteContact(id: $id) {
      errors {
        key
        message
      }
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation createContact($input: ContactInput!) {
    createContact(input: $input) {
      contact {
        id
        name
        phone
      }
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation updateContact($id: ID!, $input: ContactInput!) {
    updateContact(id: $id, input: $input) {
      contact {
        id
        name
        phone
      }
    }
  }
`;

export const UPDATE_CONTACT_TAGS = gql`
  mutation updateContactTags($input: ContactTagsInput!) {
    updateContactTags(input: $input) {
      contactTags {
        id
      }
    }
  }
`;
