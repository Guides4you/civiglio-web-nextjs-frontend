export const createStatisticheTest = /* GraphQL */ `
  mutation CreateStatisticheTest($input: CreateStatisticheTestInput!) {
    createStatisticheTest(input: $input)
  }
`;

export const addAscoltoMedia = /* GraphQL */ `
  mutation AddAscoltoMedia($PK: String!, $SK: String!, $fieldname: String!) {
    addAscoltoMedia(PK: $PK, SK: $SK, fieldname: $fieldname)
  }
`;
