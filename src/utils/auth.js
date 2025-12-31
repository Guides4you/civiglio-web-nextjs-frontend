/**
 * Authentication utility functions for Next.js
 */

export const isUserAuthenticated = () => {
  if (typeof window === 'undefined') {
    return { current: null };
  }

  try {
    // Check if we're in a browser environment
    const { Auth } = require('aws-amplify');

    // Synchronous check using cached session
    let currentUser = null;

    Auth.currentAuthenticatedUser()
      .then((user) => {
        currentUser = user;
      })
      .catch(() => {
        currentUser = null;
      });

    return { current: currentUser };
  } catch (error) {
    return { current: null };
  }
};

export const getUserInfo = async () => {
  try {
    const { Auth } = await import('aws-amplify');
    const user = await Auth.currentUserInfo();
    return user;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const { Auth } = await import('aws-amplify');
    await Auth.currentAuthenticatedUser();
    return true;
  } catch (error) {
    return false;
  }
};

export const signOut = async () => {
  try {
    const { Auth } = await import('aws-amplify');
    await Auth.signOut();
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};
