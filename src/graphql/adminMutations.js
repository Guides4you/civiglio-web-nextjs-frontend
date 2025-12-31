export const adminApproveMedia = /* GraphQL */ `
  mutation AdminApproveMedia($PK: String!, $SK: String!, $hashKey: Int!) {
    adminApproveMedia(PK: $PK, SK: $SK, hashKey: $hashKey)
  }
`;

export const adminRejectMedia = /* GraphQL */ `
  mutation AdminRejectMedia($PK: String!, $SK: String!, $motivo: String) {
    adminRejectMedia(PK: $PK, SK: $SK, motivo: $motivo)
  }
`;

export const changePoiCoords = /* GraphQL */ `
  mutation ChangePoiCoords($hashKey: Int, $oldRangeKey: String, $lat: Float, $lng: Float) {
    changePoiCoords(hashKey: $hashKey, oldRangeKey: $oldRangeKey, lat: $lat, lng: $lng) {
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
  }
`;

export const adminLinkMediaJS = /* GraphQL */ `
  mutation AdminLinkMediaJS($PK: String!, $SK: String!, $newRangeKey: String!) {
    adminLinkMediaJS(PK: $PK, SK: $SK, newRangeKey: $newRangeKey)
  }
`;

export const adminPublishMedia = /* GraphQL */ `
  mutation AdminPublishMedia($PK: String!, $SK: String!) {
    adminPublishMedia(PK: $PK, SK: $SK)
  }
`;
