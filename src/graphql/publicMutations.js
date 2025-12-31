export const addLikeMedia = /* GraphQL */ `
  mutation AddLikeMedia($PK: String!, $SK: String!, $user: String!) {
    addLikeMedia(PK: $PK, SK: $SK, user: $user) {
      PK
      SK
      __typename
      audioExtract
      audioFile
      audioTitle
      createdAt
      description
      immagine
      likemedia
      id
      lingua
      price
      proprietario
      proprietario_uuid
      tags
      updatedAt
      linked
      liked
      geopoi {
        geohash
        geoJson
        hashKey
        immagine
        proprietario
        proprietario_uuid
        rangeKey
        stato
        tipo
        url
        follower
        likes
        listen
      }
      poi {
        PK
        SK
        __typename
        createdAt
        id
        lingua
        proprietario
        proprietario_uuid
        titolo
        updatedAt
      }
    }
  }
`;

export const addFollowerLikeListen = /* GraphQL */ `
  mutation AddFollowerLikeListen(
    $input: FollowerLikeListenInput!
    $type: String!
  ) {
    addFollowerLikeListen(input: $input, type: $type) {
      geohash
      geoJson
      hashKey
      immagine
      proprietario
      proprietario_uuid
      rangeKey
      stato
      tipo
      url
      follower
      likes
      listen
      audioMediaItems {
        nextToken
      }
    }
  }
`;

export const removeFollowerLikeListen = /* GraphQL */ `
  mutation RemoveFollowerLikeListen(
    $input: FollowerLikeListenInput!
    $type: String!
  ) {
    removeFollowerLikeListen(input: $input, type: $type) {
      geohash
      geoJson
      hashKey
      immagine
      proprietario
      proprietario_uuid
      rangeKey
      stato
      tipo
      url
      follower
      likes
      listen
      audioMediaItems {
        nextToken
      }
    }
  }
`;

export const removeLikeMedia = /* GraphQL */ `
  mutation RemoveLikeMedia($PK: String!, $SK: String!, $user: String!) {
    removeLikeMedia(PK: $PK, SK: $SK, user: $user) {
      PK
      SK
      __typename
      audioExtract
      audioFile
      audioTitle
      createdAt
      description
      immagine
      likemedia
      id
      lingua
      price
      proprietario
      proprietario_uuid
      tags
      updatedAt
      linked
      liked
      geopoi {
        geohash
        geoJson
        hashKey
        immagine
        proprietario
        proprietario_uuid
        rangeKey
        stato
        tipo
        url
        follower
        likes
        listen
      }
      poi {
        PK
        SK
        __typename
        createdAt
        id
        lingua
        proprietario
        proprietario_uuid
        titolo
        updatedAt
      }
    }
  }
`;

export const addFollowerCanale = /* GraphQL */ `
  mutation AddFollowerCanale($canale: String!, $user: String!) {
    addFollowerCanale(canale: $canale, user: $user)
  }
`;
export const removeFollowerCanale = /* GraphQL */ `
  mutation RemoveFollowerCanale($canale: String!, $user: String!) {
    removeFollowerCanale(canale: $canale, user: $user)
  }
`;