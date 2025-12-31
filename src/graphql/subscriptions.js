/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTestMedia = /* GraphQL */ `
  subscription OnCreateTestMedia($PK: String, $SK: String) {
    onCreateTestMedia(PK: $PK, SK: $SK) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
    }
  }
`;
export const onUpdateTestMedia = /* GraphQL */ `
  subscription OnUpdateTestMedia($PK: String, $SK: String) {
    onUpdateTestMedia(PK: $PK, SK: $SK) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
    }
  }
`;
export const onDeleteTestMedia = /* GraphQL */ `
  subscription OnDeleteTestMedia($PK: String, $SK: String) {
    onDeleteTestMedia(PK: $PK, SK: $SK) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
    }
  }
`;
export const onCreateStatisticheTest = /* GraphQL */ `
  subscription OnCreateStatisticheTest(
    $PK: String
    $SK: String
    $evento: String
    $created_at: AWSDateTime
    $mediaId: String
  ) {
    onCreateStatisticheTest(
      PK: $PK
      SK: $SK
      evento: $evento
      created_at: $created_at
      mediaId: $mediaId
    )
  }
`;
