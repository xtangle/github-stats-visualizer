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
`)();

export const fetchPullRequestData = (api, auth, searchQuery) => createClient(api, auth).query(`
  (@autodeclare) {
    search(query: $searchQuery, type: ISSUE, first: 100) {
      issueCount
      nodes {
        ... on PullRequest {
          repository {
            name
          }
          url
          title
          author {
            login
          }
          closed
          merged
          createdAt
          closedAt
          commits(first: 0) {
            totalCount
          }
          files(first: 100) {
            totalCount
            nodes {
              additions
              deletions
            }
          }
          participants(first: 0) {
            totalCount
          }
          reviews(first: 0) {
            totalCount
          }
          url
        }
      }
    }
  }
`)({
  searchQuery: `${searchQuery} type:pr`
});
