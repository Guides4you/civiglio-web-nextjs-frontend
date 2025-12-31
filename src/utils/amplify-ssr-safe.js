// Helper functions per gestire Amplify in modo SSR-safe

export const isClient = () => typeof window !== 'undefined';

export const getAuthToken = () => {
  if (!isClient()) return null;
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token) => {
  if (!isClient()) return;
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = () => {
  if (!isClient()) return;
  localStorage.removeItem('auth_token');
};

export const getSessionData = (key) => {
  if (!isClient()) return null;
  return sessionStorage.getItem(key);
};

export const setSessionData = (key, value) => {
  if (!isClient()) return;
  sessionStorage.setItem(key, value);
};

export const removeSessionData = (key) => {
  if (!isClient()) return;
  sessionStorage.removeItem(key);
};

// Wrapper per Auth.currentAuthenticatedUser con SSR check
export const getCurrentUser = async () => {
  if (!isClient()) return null;

  const { Auth } = await import('aws-amplify');
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    return null;
  }
};

// Wrapper per Auth.currentSession con SSR check
export const getCurrentSession = async () => {
  if (!isClient()) return null;

  const { Auth } = await import('aws-amplify');
  try {
    const session = await Auth.currentSession();
    return session;
  } catch (error) {
    return null;
  }
};

// Wrapper per chiamate API GraphQL con error handling
export const safeGraphQLCall = async (operation, variables = {}) => {
  if (!isClient()) {
    console.warn('GraphQL call attempted on server side');
    return null;
  }

  const { API, graphqlOperation } = await import('aws-amplify');
  try {
    const result = await API.graphql(graphqlOperation(operation, variables));
    return result;
  } catch (error) {
    console.error('GraphQL error:', error);
    throw error;
  }
};

// Wrapper per Storage operations
export const safeStoragePut = async (key, file, options = {}) => {
  if (!isClient()) {
    console.warn('Storage.put attempted on server side');
    return null;
  }

  const { Storage } = await import('aws-amplify');
  try {
    const result = await Storage.put(key, file, options);
    return result;
  } catch (error) {
    console.error('Storage.put error:', error);
    throw error;
  }
};

export const safeStorageGet = async (key, options = {}) => {
  if (!isClient()) {
    console.warn('Storage.get attempted on server side');
    return null;
  }

  const { Storage } = await import('aws-amplify');
  try {
    const result = await Storage.get(key, options);
    return result;
  } catch (error) {
    console.error('Storage.get error:', error);
    throw error;
  }
};
