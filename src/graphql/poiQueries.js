export const listLingue = /* GraphQL */ `
  query ListLingue($id: String!) {
    listLingue(id: $id) {
      items {
        PK
        SK
        createdAt
        lingua
        audioExtract
        audioFile
        audioTitle
        description
        price
        proprietario
        proprietario_uuid
        immagine
        tags
        linked
        stato_media
        richiesta_pubblicazione
        poi {
          titolo
        }
      }
      nextToken
    }
  }
`;

export const listMediaByProprietario = /* GraphQL */ `
  query ListMediaByProprietario(
    $filter: ProprietarioMediaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMediaByProprietario(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        PK
        SK
        __typename
        audioExtract
        audioFile
        audioTitle
        createdAt
        description
        id
        lingua
        price
        proprietario
        proprietario_uuid
        tags
        immagine
        updatedAt
        stato_media
        richiesta_pubblicazione
        motivoRifiuto
        poi {
          titolo
        }
        geopoi {
          follower
          listen
          likes
          immagine
        }
      }
      nextToken
    }
  }
`;

export const getMedia = /* GraphQL */ `
  query GetMedia($PK: String, $SK: String!) {
    getMedia(PK: $PK, SK: $SK) {
      PK
      SK
      __typename
      audioExtract
      audioFile
      audioTitle
      createdAt
      description
      id
      lingua
      price
      proprietario
      proprietario_uuid
      tags
      updatedAt
      immagine
      linked
      richiesta_pubblicazione
      stato_media
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
