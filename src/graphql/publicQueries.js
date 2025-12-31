export const queryLastPoiForHome = /* GraphQL */ `
		query GetLastPoiForHome($limit: Int, $nextToken: String) {
		  getLastPoiForHome(limit: $limit, nextToken: $nextToken) {
			items {
			  geohash
			  geoJson
			  hashKey
			  immagine
			  proprietario_uuid
			  rangeKey
			  stato
			  tipo
			  url
			  follower
			  likes
			  listen
			  audioMediaItems {
				  items {
					PK
					SK
					audioFile
					audioExtract
					audioTitle
					immagine
					proprietario
					price
					lingua
					geopoi {
						immagine
					}
					poi {
						titolo
					}
				}
			  }
			}
			nextToken
		  }
		}
	  `;

export const getGeoPoi = /* GraphQL */`
	query GetGeoPoi($rangeKey: String!, $SK: String! ) {
		getPoi(PK: $rangeKey, SK: $SK) {
			id
			titolo
		}
		getGeoPoi(rangeKey: $rangeKey) {
			
			audioMediaItems {
				nextToken
				items {
					liked
					proprietario_uuid
					PK
					SK
					audioFile
					audioExtract
					audioTitle
					lingua
					price
					owner {
						channelTitle
					}
					poi {
						titolo
					}
					geopoi{
						immagine
						geoJson
					}
					description
					immagine
					linked,
				}
			}
			follower
			geoJson
			geohash
			hashKey
			immagine
			likes
			listen
			proprietario
			proprietario_uuid
			rangeKey
			stato
			tipo
			url
			
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
	id
	lingua
	price
	proprietario
	proprietario_uuid
	tags
	updatedAt
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

export const getUserChannel = /* GraphQL */ `
  query GetUserChannel($username: String!) {
    getUserChannel(username: $username) {
      channelName
      registered
    }
  }
`;

export const getLikeMediaByUser = /* GraphQL */ `
  query GetLikeMediaByUser($SK: String!, $user: String!) {
    getLikeMediaByUser(SK: $SK, user: $user)
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

export const getFollowedCanaleByUser = /* GraphQL */ `
  query GetFollowedCanaleByUser($canale: String!, $user: String!) {
    getFollowedCanaleByUser(canale: $canale, user: $user)
  }
`;

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
    }
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
        tags
        updatedAt
        linked
        ascoltoAbstract
        ascoltoAudio
        lingueDisponibili
      }
      nextToken
    }
  }
`;


