/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProfileInfo = /* GraphQL */ `
  query GetProfileInfo($PK: String!) {
    getProfileInfo(PK: $PK) {
      PK
      SK
      publicProfile
      email
      name
      surname
      channelTitle
      channelDescription
      billingCompany
      billingCountry
      billingZipCode
      billingStreet
      billingVatFiscalCode
      paymentMethod
      paymentData
      createdAt
      followers
      immagine
      __typename
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
        immagine
        likemedia
        id
        lingua
        price
        proprietario
        proprietario_uuid
        owner {
          PK
          SK
          publicProfile
          email
          name
          surname
          channelTitle
          channelDescription
          billingCompany
          billingCountry
          billingZipCode
          billingStreet
          billingVatFiscalCode
          paymentMethod
          paymentData
          createdAt
          followers
          immagine
          __typename
        }
        tags
        updatedAt
        linked
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
          dateStart
          dateEnd
          public
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
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
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
        }
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
        richiesta_pubblicazione
        motivoRifiuto
        liked
        __typename
      }
      nextToken
      __typename
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
      immagine
      likemedia
      id
      lingua
      price
      proprietario
      proprietario_uuid
      owner {
        PK
        SK
        publicProfile
        email
        name
        surname
        channelTitle
        channelDescription
        billingCompany
        billingCountry
        billingZipCode
        billingStreet
        billingVatFiscalCode
        paymentMethod
        paymentData
        createdAt
        followers
        immagine
        __typename
      }
      tags
      updatedAt
      linked
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
        dateStart
        dateEnd
        public
        audioMediaItems {
          items {
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
            stato_media
            ascoltoAbstract
            ascoltoAudio
            lingueDisponibili
            richiesta_pubblicazione
            motivoRifiuto
            liked
            __typename
          }
          nextToken
          __typename
        }
        __typename
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
        audioMediaItems {
          items {
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
            stato_media
            ascoltoAbstract
            ascoltoAudio
            lingueDisponibili
            richiesta_pubblicazione
            motivoRifiuto
            liked
            __typename
          }
          nextToken
          __typename
        }
        __typename
      }
      ascoltoAbstract
      ascoltoAudio
      lingueDisponibili
      richiesta_pubblicazione
      motivoRifiuto
      liked
      __typename
    }
  }
`;
export const listLingue = /* GraphQL */ `
  query ListLingue($id: String!) {
    listLingue(id: $id) {
      items {
        PK
        SK
        lingua
        audioExtract
        createdAt
        audioFile
        audioTitle
        description
        price
        proprietario
        proprietario_uuid
        immagine
        linked
        stato_media
        tags
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
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
        }
        richiesta_pubblicazione
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGeoPoi = /* GraphQL */ `
  query GetGeoPoi($rangeKey: String!) {
    getGeoPoi(rangeKey: $rangeKey) {
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
      dateStart
      dateEnd
      public
      audioMediaItems {
        items {
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
          owner {
            PK
            SK
            publicProfile
            email
            name
            surname
            channelTitle
            channelDescription
            billingCompany
            billingCountry
            billingZipCode
            billingStreet
            billingVatFiscalCode
            paymentMethod
            paymentData
            createdAt
            followers
            immagine
            __typename
          }
          tags
          updatedAt
          linked
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
            dateStart
            dateEnd
            public
            __typename
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
            __typename
          }
          ascoltoAbstract
          ascoltoAudio
          lingueDisponibili
          richiesta_pubblicazione
          motivoRifiuto
          liked
          __typename
        }
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const getPoi = /* GraphQL */ `
  query GetPoi($PK: String!, $SK: String!) {
    getPoi(PK: $PK, SK: $SK) {
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
      audioMediaItems {
        items {
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
          owner {
            PK
            SK
            publicProfile
            email
            name
            surname
            channelTitle
            channelDescription
            billingCompany
            billingCountry
            billingZipCode
            billingStreet
            billingVatFiscalCode
            paymentMethod
            paymentData
            createdAt
            followers
            immagine
            __typename
          }
          tags
          updatedAt
          linked
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
            dateStart
            dateEnd
            public
            __typename
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
            __typename
          }
          ascoltoAbstract
          ascoltoAudio
          lingueDisponibili
          richiesta_pubblicazione
          motivoRifiuto
          liked
          __typename
        }
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const getLastPoiForHome = /* GraphQL */ `
  query GetLastPoiForHome($limit: Int, $nextToken: String) {
    getLastPoiForHome(limit: $limit, nextToken: $nextToken) {
      items {
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
        dateStart
        dateEnd
        public
        audioMediaItems {
          items {
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
            stato_media
            ascoltoAbstract
            ascoltoAudio
            lingueDisponibili
            richiesta_pubblicazione
            motivoRifiuto
            liked
            __typename
          }
          nextToken
          __typename
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLastPoiForHomeIdroscalo = /* GraphQL */ `
  query GetLastPoiForHomeIdroscalo($limit: Int, $nextToken: String) {
    getLastPoiForHomeIdroscalo(limit: $limit, nextToken: $nextToken) {
      items {
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
        dateStart
        dateEnd
        public
        audioMediaItems {
          items {
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
            stato_media
            ascoltoAbstract
            ascoltoAudio
            lingueDisponibili
            richiesta_pubblicazione
            motivoRifiuto
            liked
            __typename
          }
          nextToken
          __typename
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFollowedCanaleByUser = /* GraphQL */ `
  query GetFollowedCanaleByUser($canale: String!, $user: String!) {
    getFollowedCanaleByUser(canale: $canale, user: $user)
  }
`;
export const getFollowerLikelistenByProprietario = /* GraphQL */ `
  query GetFollowerLikelistenByProprietario(
    $proprietario: String!
    $type: String
  ) {
    getFollowerLikelistenByProprietario(
      proprietario: $proprietario
      type: $type
    )
  }
`;
export const listMediaByProprietario2 = /* GraphQL */ `
  query ListMediaByProprietario2($proprietario: String!) {
    listMediaByProprietario2(proprietario: $proprietario) {
      items {
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
        owner {
          PK
          SK
          publicProfile
          email
          name
          surname
          channelTitle
          channelDescription
          billingCompany
          billingCountry
          billingZipCode
          billingStreet
          billingVatFiscalCode
          paymentMethod
          paymentData
          createdAt
          followers
          immagine
          __typename
        }
        tags
        updatedAt
        linked
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
          dateStart
          dateEnd
          public
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
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
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
        }
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
        richiesta_pubblicazione
        motivoRifiuto
        liked
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLikeMediaByUser = /* GraphQL */ `
  query GetLikeMediaByUser($SK: String!, $user: String!) {
    getLikeMediaByUser(SK: $SK, user: $user)
  }
`;
export const adminGetMediaDaValidare = /* GraphQL */ `
  query AdminGetMediaDaValidare {
    adminGetMediaDaValidare {
      items {
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
        owner {
          PK
          SK
          publicProfile
          email
          name
          surname
          channelTitle
          channelDescription
          billingCompany
          billingCountry
          billingZipCode
          billingStreet
          billingVatFiscalCode
          paymentMethod
          paymentData
          createdAt
          followers
          immagine
          __typename
        }
        tags
        updatedAt
        linked
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
          dateStart
          dateEnd
          public
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
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
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
        }
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
        richiesta_pubblicazione
        motivoRifiuto
        liked
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const adminGetAllMedia = /* GraphQL */ `
  query AdminGetAllMedia {
    adminGetAllMedia {
      items {
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
        owner {
          PK
          SK
          publicProfile
          email
          name
          surname
          channelTitle
          channelDescription
          billingCompany
          billingCountry
          billingZipCode
          billingStreet
          billingVatFiscalCode
          paymentMethod
          paymentData
          createdAt
          followers
          immagine
          __typename
        }
        tags
        updatedAt
        linked
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
          dateStart
          dateEnd
          public
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
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
          audioMediaItems {
            nextToken
            __typename
          }
          __typename
        }
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
        richiesta_pubblicazione
        motivoRifiuto
        liked
        __typename
      }
      nextToken
      __typename
    }
  }
`;
