const dev = {
  API_ENDPOINT_URL: 'https://jsonplaceholder.typicode.com'
};

const prod = {
  API_ENDPOINT_URL: 'https://api.prod.com'
};

const test = {
  API_ENDPOINT_URL: 'https://api.test.com'
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			return dev; // Default a dev se non specificato
	}
}

export const env = getEnv()
