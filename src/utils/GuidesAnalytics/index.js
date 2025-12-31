import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { PLAYAUDIOABSTRACT_EVENT, PLAYAUDIO_EVENT } from './constants';
import { addAscoltoMedia, createStatisticheTest } from './mutations';

/**
 * GuidesAnalytics - Analytics tracking class
 * SSR-safe for Next.js
 */
class GuidesAnalytics {
  static sessionId = null;

  /**
   * Start a new analytics session
   * @returns {string} sessionId
   */
  static startSession() {
    // Only run in browser
    if (typeof window === 'undefined') {
      return null;
    }

    this.sessionId = sessionStorage.getItem('guidesanalyticsId');
    if (!this.sessionId) {
      this.sessionId = uuidv4();
      sessionStorage.setItem('guidesanalyticsId', this.sessionId);
    }

    return this.sessionId;
  }

  /**
   * Get current session ID
   * @returns {string|null} sessionId
   */
  static getSession() {
    return this.sessionId;
  }

  /**
   * Record an analytics event
   * @param {string} evento - Event type
   * @param {object} attributes - Event attributes
   */
  static async recordEvent(evento, attributes) {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Ensure session is started
    if (!this.sessionId) {
      this.startSession();
    }

    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const d = moment();

      const response = await API.graphql(
        graphqlOperation(createStatisticheTest, {
          input: {
            PK: this.sessionId,
            SK: `${evento}_${attributes.mediaId}_${d.format('YYYYMMDDHHmmss')}`,
            created_at: new Date().toISOString(),
            evento: evento,
            mediaId: attributes.mediaId,
            userId: attributes.userId
          }
        })
      );

      if (response.data.createStatisticheTest === "aggiorna") {
        switch (evento) {
          case PLAYAUDIO_EVENT:
            await API.graphql(
              graphqlOperation(addAscoltoMedia, {
                PK: attributes.PK,
                SK: attributes.mediaId,
                fieldname: 'ascoltoAudio',
              })
            );
            break;
          case PLAYAUDIOABSTRACT_EVENT:
            await API.graphql(
              graphqlOperation(addAscoltoMedia, {
                PK: attributes.PK,
                SK: attributes.mediaId,
                fieldname: 'ascoltoAbstract',
              })
            );
            break;
          default:
            break;
        }
      }
    } catch (error) {
      console.error('GuidesAnalytics error:', error);
    }
  }
}

export default GuidesAnalytics;
