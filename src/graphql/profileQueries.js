export const getProfileInfo = /* GraphQL */ `
  query GetProfileInfo($PK: String!) {
    getProfileInfo(PK: $PK) {
      PK
      SK
      email
      publicProfile
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
      immagine
    }
  }
`;
