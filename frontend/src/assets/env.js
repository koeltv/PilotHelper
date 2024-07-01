window['env'] = {
  enableKeycloak: true,
  backendUrl: "${BACKEND_URL}",
  auth: {
    url: "${AUTH_URL}",
    realm: "${AUTH_REALM}",
    clientId: "${AUTH_CLIENT_ID}"
  }
};
