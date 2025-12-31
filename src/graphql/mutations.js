/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProfileInfo = /* GraphQL */ `
  mutation CreateProfileInfo($input: ProfileInfoInput) {
    createProfileInfo(input: $input) {
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
export const updateProfileInfo = /* GraphQL */ `
  mutation UpdateProfileInfo($input: ProfileInfoInput) {
    updateProfileInfo(input: $input) {
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
export const updateProfileChannel = /* GraphQL */ `
  mutation UpdateProfileChannel($PK: String!, $channelTitle: String!) {
    updateProfileChannel(PK: $PK, channelTitle: $channelTitle) {
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
export const createAudioMedia = /* GraphQL */ `
  mutation CreateAudioMedia($input: CreateMediaInput!) {
    createAudioMedia(input: $input) {
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
export const updateAudioMedia = /* GraphQL */ `
  mutation UpdateAudioMedia($input: UpdateMediaInput!) {
    updateAudioMedia(input: $input) {
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
export const createPoi = /* GraphQL */ `
  mutation CreatePoi($input: CreatePoiInput!) {
    createPoi(input: $input) {
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
export const updatePoi = /* GraphQL */ `
  mutation UpdatePoi($input: UpdatePoiInput!) {
    updatePoi(input: $input) {
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
export const createTestMedia = /* GraphQL */ `
  mutation CreateTestMedia($input: CreateTestMediaInput!) {
    createTestMedia(input: $input) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
      __typename
    }
  }
`;
export const updateTestMedia = /* GraphQL */ `
  mutation UpdateTestMedia($input: UpdateTestMediaInput!) {
    updateTestMedia(input: $input) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
      __typename
    }
  }
`;
export const deleteTestMedia = /* GraphQL */ `
  mutation DeleteTestMedia($input: DeleteTestMediaInput!) {
    deleteTestMedia(input: $input) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
      __typename
    }
  }
`;
export const addFollowerCanale = /* GraphQL */ `
  mutation AddFollowerCanale($canale: String!, $user: String!) {
    addFollowerCanale(canale: $canale, user: $user)
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
export const removeFollowerCanale = /* GraphQL */ `
  mutation RemoveFollowerCanale($canale: String!, $user: String!) {
    removeFollowerCanale(canale: $canale, user: $user)
  }
`;
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
export const publishPoi = /* GraphQL */ `
  mutation PublishPoi($hashKey: Int!, $rangeKey: String!, $public: Boolean) {
    publishPoi(hashKey: $hashKey, rangeKey: $rangeKey, public: $public) {
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
export const richiestaPubblicazioneMedia = /* GraphQL */ `
  mutation RichiestaPubblicazioneMedia(
    $PK: String!
    $SK: String!
    $value: Boolean
  ) {
    richiestaPubblicazioneMedia(PK: $PK, SK: $SK, value: $value)
  }
`;
export const adminPublishMedia = /* GraphQL */ `
  mutation AdminPublishMedia($PK: String!, $SK: String!) {
    adminPublishMedia(PK: $PK, SK: $SK)
  }
`;
export const adminRejectMedia = /* GraphQL */ `
  mutation AdminRejectMedia($PK: String!, $SK: String!, $motivo: String) {
    adminRejectMedia(PK: $PK, SK: $SK, motivo: $motivo)
  }
`;
export const addMediaLikeListen = /* GraphQL */ `
  mutation AddMediaLikeListen(
    $PK: String!
    $proprietario: String!
    $typename: String!
  ) {
    addMediaLikeListen(
      PK: $PK
      proprietario: $proprietario
      typename: $typename
    ) {
      PK
      SK
      __typename
      createdAt
      id
      lingua
      updatedAt
      __typename
    }
  }
`;
export const addAscoltoMedia = /* GraphQL */ `
  mutation AddAscoltoMedia($PK: String!, $SK: String!, $fieldname: String!) {
    addAscoltoMedia(PK: $PK, SK: $SK, fieldname: $fieldname)
  }
`;
export const statRecordEvent = /* GraphQL */ `
  mutation StatRecordEvent($input: StatEventInput!) {
    statRecordEvent(input: $input)
  }
`;
export const createStatisticheTest = /* GraphQL */ `
  mutation CreateStatisticheTest($input: CreateStatisticheTestInput!) {
    createStatisticheTest(input: $input)
  }
`;
export const adminApproveMedia = /* GraphQL */ `
  mutation AdminApproveMedia($PK: String!, $SK: String!, $hashKey: Int!) {
    adminApproveMedia(PK: $PK, SK: $SK, hashKey: $hashKey)
  }
`;
export const adminLinkMediaJS = /* GraphQL */ `
  mutation AdminLinkMediaJS($PK: String!, $SK: String!, $newRangeKey: String!) {
    adminLinkMediaJS(PK: $PK, SK: $SK, newRangeKey: $newRangeKey)
  }
`;
export const changePoiCoords = /* GraphQL */ `
  mutation ChangePoiCoords(
    $hashKey: Int
    $oldRangeKey: String
    $lat: Float
    $lng: Float
  ) {
    changePoiCoords(
      hashKey: $hashKey
      oldRangeKey: $oldRangeKey
      lat: $lat
      lng: $lng
    ) {
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
