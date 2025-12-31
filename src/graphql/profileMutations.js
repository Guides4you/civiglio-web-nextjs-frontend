export const createProfileInfo = /* GraphQL */ `
  mutation CreateProfileInfo($input: ProfileInfoInput) {
    createProfileInfo(input: $input) {
      PK
      SK
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
    }
  }
`;

export const updateProfileInfo = /* GraphQL */ `
  mutation UpdateProfileInfo($input: ProfileInfoInput) {
    updateProfileInfo(input: $input) {
      PK
      SK
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
      immagine
    }
  }
`;
