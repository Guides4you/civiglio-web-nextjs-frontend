import { useState } from 'react';
import { Card, Button, Divider, Alert, Spin, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * GraphQL Integration Test Page
 * Tests all GraphQL queries and mutations
 */
export default function GraphQLTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const addResult = (testName, success, message, data = null) => {
    setResults(prev => ({
      ...prev,
      [testName]: { success, message, data, timestamp: new Date().toISOString() }
    }));
  };

  const setTestLoading = (testName, isLoading) => {
    setLoading(prev => ({ ...prev, [testName]: isLoading }));
  };

  // Test 1: Public Query - Get POIs for Home
  const testPublicPoiQuery = async () => {
    setTestLoading('publicPoi', true);
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api');
      const { queryLastPoiForHome } = await import('../../src/graphql/publicQueries');

      const result = await API.graphql({
        query: queryLastPoiForHome,
        variables: { limit: 5 },
        authMode: GRAPHQL_AUTH_MODE.API_KEY
      });

      const items = result.data?.getLastPoiForHome?.items || [];
      addResult('publicPoi', true, `Retrieved ${items.length} POIs`, items.slice(0, 2));
    } catch (error) {
      addResult('publicPoi', false, error.message);
    } finally {
      setTestLoading('publicPoi', false);
    }
  };

  // Test 2: Public Query - Get Single POI
  const testGetGeoPoi = async () => {
    setTestLoading('geoPoi', true);
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const { GRAPHQL_AUTH_MODE } = await import('@aws-amplify/api');
      const { getGeoPoi } = await import('../../src/graphql/publicQueries');

      // First get a POI ID from the list
      const { queryLastPoiForHome } = await import('../../src/graphql/publicQueries');
      const listResult = await API.graphql({
        query: queryLastPoiForHome,
        variables: { limit: 1 },
        authMode: GRAPHQL_AUTH_MODE.API_KEY
      });

      const items = listResult.data?.getLastPoiForHome?.items || [];
      if (items.length === 0) {
        addResult('geoPoi', false, 'No POIs available to test');
        return;
      }

      const poiId = items[0].hashKey;
      const result = await API.graphql({
        query: getGeoPoi,
        variables: { hashKey: poiId },
        authMode: GRAPHQL_AUTH_MODE.API_KEY
      });

      const poi = result.data?.getGeoPoi;
      addResult('geoPoi', true, `Retrieved POI: ${poi?.titolo || 'N/A'}`, poi);
    } catch (error) {
      addResult('geoPoi', false, error.message);
    } finally {
      setTestLoading('geoPoi', false);
    }
  };

  // Test 3: Check Authentication Status
  const testAuthentication = async () => {
    setTestLoading('auth', true);
    try {
      const { Auth } = await import('aws-amplify');
      const user = await Auth.currentAuthenticatedUser();
      addResult('auth', true, `Authenticated as: ${user.username}`, {
        username: user.username,
        email: user.attributes.email
      });
    } catch (error) {
      addResult('auth', false, 'Not authenticated - login required for protected tests');
    } finally {
      setTestLoading('auth', false);
    }
  };

  // Test 4: Profile Query (requires auth)
  const testProfileQuery = async () => {
    setTestLoading('profile', true);
    try {
      const { Auth, API, graphqlOperation } = await import('aws-amplify');
      const user = await Auth.currentAuthenticatedUser();
      const { getProfileInfo } = await import('../../src/graphql/profileQueries');

      const result = await API.graphql(
        graphqlOperation(getProfileInfo, {
          PK: user.attributes.sub
        })
      );

      const profile = result.data?.getProfileInfo;
      addResult('profile', true, `Profile loaded: ${profile?.name || 'No name'}`, profile);
    } catch (error) {
      addResult('profile', false, error.message);
    } finally {
      setTestLoading('profile', false);
    }
  };

  // Test 5: List User POIs (requires auth)
  const testUserPoiList = async () => {
    setTestLoading('userPoi', true);
    try {
      const { Auth, API, graphqlOperation } = await import('aws-amplify');
      const user = await Auth.currentAuthenticatedUser();
      const { listMediaByProprietario } = await import('../../src/graphql/poiQueries');

      const result = await API.graphql(
        graphqlOperation(listMediaByProprietario, {
          proprietario_uuid: user.attributes.sub,
          limit: 5
        })
      );

      const items = result.data?.listMediaByProprietario?.items || [];
      addResult('userPoi', true, `Found ${items.length} user POIs`, items.slice(0, 2));
    } catch (error) {
      addResult('userPoi', false, error.message);
    } finally {
      setTestLoading('userPoi', false);
    }
  };

  // Test 6: List Languages
  const testListLanguages = async () => {
    setTestLoading('languages', true);
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const { listLingue } = await import('../../src/graphql/poiQueries');

      const result = await API.graphql(graphqlOperation(listLingue));
      const items = result.data?.listLingue?.items || [];
      addResult('languages', true, `Found ${items.length} languages`, items);
    } catch (error) {
      addResult('languages', false, error.message);
    } finally {
      setTestLoading('languages', false);
    }
  };

  // Test 7: Admin Query - Media Validation (requires admin auth)
  const testAdminMediaQuery = async () => {
    setTestLoading('adminMedia', true);
    try {
      const { API, graphqlOperation } = await import('aws-amplify');
      const { adminGetMediaDaValidare } = await import('../../src/graphql/adminQueries');

      const result = await API.graphql(
        graphqlOperation(adminGetMediaDaValidare)
      );

      const items = result.data?.adminGetMediaDaValidare?.items || [];
      addResult('adminMedia', true, `Found ${items.length} media pending validation`, items.slice(0, 2));
    } catch (error) {
      addResult('adminMedia', false, error.message);
    } finally {
      setTestLoading('adminMedia', false);
    }
  };

  const runAllPublicTests = async () => {
    await testPublicPoiQuery();
    await testGetGeoPoi();
    await testListLanguages();
  };

  const runAllAuthTests = async () => {
    await testAuthentication();
    await testProfileQuery();
    await testUserPoiList();
  };

  const runAllAdminTests = async () => {
    await testAuthentication();
    await testAdminMediaQuery();
  };

  const ResultItem = ({ testName, result }) => {
    if (!result) return null;

    return (
      <Card
        size="small"
        style={{ marginBottom: 12 }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {result.success ? (
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
            ) : (
              <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
            )}
            <Text strong>{testName}</Text>
          </div>
        }
      >
        <Alert
          message={result.message}
          type={result.success ? 'success' : 'error'}
          showIcon
          style={{ marginBottom: result.data ? 12 : 0 }}
        />
        {result.data && (
          <pre style={{
            background: '#f5f5f5',
            padding: 12,
            borderRadius: 4,
            fontSize: 12,
            maxHeight: 200,
            overflow: 'auto'
          }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        )}
        <Text type="secondary" style={{ fontSize: 11 }}>
          {new Date(result.timestamp).toLocaleString()}
        </Text>
      </Card>
    );
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>GraphQL Integration Tests</Title>
      <Text type="secondary">
        Test suite for verifying GraphQL queries and mutations
      </Text>

      <Divider />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Public Tests */}
        <Card title="Public API Tests (No Auth Required)" size="small">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              onClick={testPublicPoiQuery}
              loading={loading.publicPoi}
              block
            >
              Test: Get POIs for Home
            </Button>
            <Button
              onClick={testGetGeoPoi}
              loading={loading.geoPoi}
              block
            >
              Test: Get Single POI
            </Button>
            <Button
              onClick={testListLanguages}
              loading={loading.languages}
              block
            >
              Test: List Languages
            </Button>
            <Divider />
            <Button
              type="primary"
              onClick={runAllPublicTests}
              block
            >
              Run All Public Tests
            </Button>
          </div>
        </Card>

        {/* Authenticated Tests */}
        <Card title="Authenticated API Tests (Login Required)" size="small">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              onClick={testAuthentication}
              loading={loading.auth}
              block
            >
              Test: Check Authentication
            </Button>
            <Button
              onClick={testProfileQuery}
              loading={loading.profile}
              block
            >
              Test: Get User Profile
            </Button>
            <Button
              onClick={testUserPoiList}
              loading={loading.userPoi}
              block
            >
              Test: List User POIs
            </Button>
            <Divider />
            <Button
              type="primary"
              onClick={runAllAuthTests}
              block
            >
              Run All Auth Tests
            </Button>
          </div>
        </Card>

        {/* Admin Tests */}
        <Card title="Admin API Tests (Admin Role Required)" size="small">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              onClick={testAdminMediaQuery}
              loading={loading.adminMedia}
              block
            >
              Test: Get Media Pending Validation
            </Button>
            <Divider />
            <Button
              type="primary"
              onClick={runAllAdminTests}
              block
            >
              Run All Admin Tests
            </Button>
          </div>
        </Card>

        {/* Clear Results */}
        <Card size="small">
          <Button
            danger
            onClick={() => setResults({})}
            block
          >
            Clear All Results
          </Button>
        </Card>
      </div>

      <Divider />

      {/* Results Section */}
      <Title level={3}>Test Results</Title>
      {Object.keys(results).length === 0 ? (
        <Alert message="No tests run yet. Click a button above to start testing." type="info" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Title level={5}>Public & Language Tests</Title>
            <ResultItem testName="Public POI Query" result={results.publicPoi} />
            <ResultItem testName="Get GeoPOI" result={results.geoPoi} />
            <ResultItem testName="List Languages" result={results.languages} />
          </div>
          <div>
            <Title level={5}>Authenticated Tests</Title>
            <ResultItem testName="Authentication Status" result={results.auth} />
            <ResultItem testName="Profile Query" result={results.profile} />
            <ResultItem testName="User POI List" result={results.userPoi} />

            <Title level={5} style={{ marginTop: 24 }}>Admin Tests</Title>
            <ResultItem testName="Admin Media Query" result={results.adminMedia} />
          </div>
        </div>
      )}
    </div>
  );
}
