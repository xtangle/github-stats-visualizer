const basicAuth = (auth = {}) => (auth.username && auth.password) ? `Basic ${btoa([auth.username, auth.password].join(':'))}` : null;

const createClient = (api, auth) => graphql(api, {
  asJSON: true,
  headers: {
    'Authorization': basicAuth(auth),
  },
});

export const fetchRateLimitData = (api, auth) => createClient(api, auth).query(`
  {
    rateLimit {
      limit
      remaining
      resetAt
    }
  }
`);
