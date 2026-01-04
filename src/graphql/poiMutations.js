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

export const updateAudioMedia = /* GraphQL */ `
  mutation UpdateAudioMedia($input: UpdateMediaInput!) {
    updateAudioMedia(input: $input) {
      PK
      SK
      audioTitle
      description
      immagine
      tags
      lingua
      audioFile
      audioExtract
      price
      stato_media
      richiesta_pubblicazione
    }
  }
`;

export const createAudioMedia = /* GraphQL */ `
  mutation CreateAudioMedia($input: CreateMediaInput!) {
    createAudioMedia(input: $input) {
      PK
      SK
      audioTitle
      description
      immagine
      tags
      lingua
      audioFile
      audioExtract
      price
      proprietario
      proprietario_uuid
      stato_media
    }
  }
`;

export const createPoi = /* GraphQL */ `
  mutation CreatePoi($input: CreatePoiInput!) {
    createPoi(input: $input) {
      PK
      SK
      titolo
      lingua
      proprietario
      proprietario_uuid
    }
  }
`;

export const updatePoi = /* GraphQL */ `
  mutation UpdatePoi($input: UpdatePoiInput!) {
    updatePoi(input: $input) {
      PK
      SK
      titolo
      lingua
    }
  }
`;
