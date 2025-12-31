export const adminGetMediaDaValidare = /* GraphQL */ `
  query AdminGetMediaDaValidare {
    adminGetMediaDaValidare {
      items {
        PK
        SK
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
        stato_media
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
        richiesta_pubblicazione
      }
    }
  }
`;

export const adminGetAllMedia = /* GraphQL */ `
  query AdminGetAllMedia {
    adminGetAllMedia {
      items {
        PK
        SK
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
        stato_media
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
        richiesta_pubblicazione
      }
    }
  }
`;

export const getMediaForAdmin = /* GraphQL */ `
  query GetMedia($PK: String, $SK: String!) {
    getMedia(PK: $PK, SK: $SK) {
      PK
      SK
      audioTitle
      description
      immagine
      audioFile
      audioExtract
      lingua
      price
      proprietario
      proprietario_uuid
      tags
      stato_media
      richiesta_pubblicazione
      ascoltoAbstract
      ascoltoAudio
      lingueDisponibili
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
        createdAt
        lingua
        proprietario
        proprietario_uuid
        titolo
        audioMediaItems {
          items {
            PK
            SK
            audioTitle
            lingua
          }
        }
      }
    }
  }
`;
