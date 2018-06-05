const fetch = require('node-fetch');

const sandboxUrl = "https://api.sandbox.wealthsimple.com/v1";

const paramsReducer = (accumulator, currentValue) => accumulator + currentValue + "&";

const buildUrlParams = (params) => {
  return Object.keys(params).map(key=>key + "=" + params[key]).reduce(paramsReducer, "?");
}

const request = (appCredentials, api, token, params, body) => {
  const postParams = buildUrlParams(Object.assign({}, appCredentials, params));
  return fetch(sandboxUrl + api.url + postParams, {
    method: api.method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json());
}

const healthCheck = request({}, {url:'/healthcheck', method:"GET"});

/**
 * Exchanges an auth code for OAuth2 tokens
 * @param {String} code - Auth string from Wealthsimple redirect
 * @returns {Promise} Fetch promise which will resolve containing OAuth2 Tokens
 * @example
 * wealthsimple.tokenExchange(authCode).then(response=>console.log(response));
 */
const tokenExchange = (appCredentials) => {
  return (code) => request(appCredentials, {url:'/oauth/token', method:"POST"}, "", {grant_type: "authorization_code", code: code});
}

/**
 * Refreshes OAuth2 tokens
 * @param {String} refreshToken - Refresh Token
 * @returns {Promise} Fetch promise which will resolve containing OAuth2 Tokens
 * @example
 * wealthsimple.tokenRefresh(refreshToken).then(response=>console.log(response));
 */
const tokenRefresh = (appCredentials) => {
  return (refreshToken) => request(appCredentials, {url:'/oauth/token', method:"POST"}, "", {grant_type: "refresh_token", refresh_token: refreshToken});
}

/**
 * Create a User
 * https://developers.wealthsimple.com/#operation/Create%20User
 *
 * @param {Object} body
 * @returns {Promise} Fetch promise which will resolve with newly created user
 * @example
 * wealthsimple.createUser(body).then(response=>console.log(response));
 */
const createUser = (appCredentials) => {
  return (body) => request(appCredentials, {url:'/users', method:"POST"}, "", {}, body);
}

/**
 * List Users
 * https://developers.wealthsimple.com/#operation/List%20Users
 * This API will return a list of Users scoped by the authorization credentials.
 *
 * @param {String} token - OAuth token for a user
 * @param {Object} [params] - See wealthsimple website for
 * @returns {Promise} Fetch promise which will resolve with newly created user
 * @example
 * wealthsimple.listUsers(token).then(response=>console.log(response));
 *
 * @example
 * let params = { limit: 25, offset: 50, created_before: "2017-06-21"};
 * wealthsimple.listUsers(token, params).then(response=>console.log(response));
 */
const listUsers = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/users', method:"GET"}, token, params);
}

/**
 * Get User
 * https://developers.wealthsimple.com/#operation/Get%20User
 *
 * @param {String} token - OAuth token for a user
 * @param {String} userId - Example "user-12398ud"
 *
 * @returns {Promise} Fetch promise which will resolve with user info
 * @example
 * wealthsimple.getUser(token, userId).then(response=>console.log(response));
 */
const getUser = (appCredentials) => {
  return (token, userId) => request(appCredentials, {url:'/users/' + userId, method:"GET"}, token);
}

/**
 * Create Person
 * https://developers.wealthsimple.com/#operation/Create%20Person
 *
 * @param {String} token - OAuth token for a user
 * @param {Object} body - See wealthsimple website for an example of the request body
 *
 * @returns {Promise} Fetch promise which will resolve with the created Person
 * @example
 * wealthsimple.createPerson(token, body).then(response=>console.log(response));
 */
const createPerson = (appCredentials) => {
  return (token, body) => request(appCredentials, {url:'/people', method:"POST"}, token, {}, body);
}
/**
 * List People
 * https://developers.wealthsimple.com/#operation/List%20People
 * This API will return a list of People scoped by the authorization credentials.
 *
 * @param {String} token - OAuth token for a user
 * @param {Object} params - See wealthsimple website for an example of the request parameters
 *
 * @returns {Promise} Fetch promise which will resolve with the created Person
 * @example
 * wealthsimple.createPerson(token, body).then(response=>console.log(response));
 */
const listPeople = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/people', method:"GET"}, token, params);
}

/**
 * Get Person
 * https://developers.wealthsimple.com/#operation/Get%20Person
 * Get a Person entity if you know the person_id and the current credentials have access to the Person.
 *
 * @param {String} token - OAuth token for a user
 * @param {String} personId - Example "person-12398ud"
 * @returns {Promise} Fetch promise which will resolve with the created Person
 * @example
 * wealthsimple.getPerson(token, "person-12398ud").then(response=>console.log(response));
 */
const getPerson = (appCredentials) => {
  return (token, personId) => request(appCredentials, {url:'/people/' + personId, method:"POST"}, token);
}
/**
 * Update Person
 * You can add/remove information to the Person entity as the information becomes available using this API. To remove a previously set attribute, set the value to null. Attributes that are not mentioned in the request payload will leave the attribute unchanged in the Person entity.
 *
 * @param {String} token - OAuth token for a user
 * @param {String} personId - Example "person-12398ud"
 * @param {Object} body - See wealthsimple website for an example of the body
 * @returns {Promise} Fetch promise which will resolve with the created Person
 * @example
 * wealthsimple.getPerson(token, "person-12398ud").then(response=>console.log(response));
 */
const updatePerson = (appCredentials) => {
  return (token, personId, body) => request(appCredentials, {url:'/people/' + personId, method:"PATCH"}, token, {}, body);
}

/* TRUSTS */
/* UNIMPLEMENTED */

/* CORPORATIONS */
/* UNIMPLEMENTED */

/* ACCOUNTS */
const createAccount = (appCredentials) => {
  return (token, body) => request(appCredentials, {url:'/accounts', method:"POST"}, token, {}, body);
}

const listAccounts = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/accounts', method:"GET"}, token, params);
}

const getAccount = (appCredentials) => {
  return (token, account) => request(appCredentials, {url:'/accounts/' + account, method:"GET"}, token);
}

const getAccountTypes = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/accounts/account_types', method:"GET"}, token, params);
}

/* DAILY VALUES */
const getDailyValues = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/daily_values/', method:"GET"}, token, params);
}

/* PROJECTIONS */
const getProjection = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/projections', method:"GET"}, token, params);
}


/* BANK ACCOUNTS */
const listBankAccounts = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/bank_accounts', method:"GET"}, token, params);
}

/* DEPOSITS */
const createDeposit = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/deposits', method:"POST"}, token, params);
}

const listDeposits = (appCredentials) => {
  return (token, params) => request(appCredentials, {url:'/deposits', method:"GET"}, token, params);
}

const getDeposits = (appCredentials) => {
  return (token, depositId, params) => request(appCredentials, {url:'/deposits/' + depositId, method:"GET"}, token, params);
}


module.exports = {
  appId(appCredentials) {
    if (typeof appCredentials.client_id === "string" && typeof appCredentials.client_secret === "string" && typeof appCredentials.redirect_uri === "string") {
      return {
        healthCheck: healthCheck,
        /* AUTH */
        tokenExchange: tokenExchange(appCredentials),
        tokenRefresh: tokenRefresh(appCredentials),
        /* USERS */
        createUser: createUser(appCredentials),
        listUsers: listUsers(appCredentials),
        getUser: getUser(appCredentials),
        /* ACCOUNTS */
        listAccounts: listAccounts(appCredentials),
        getAccount: getAccount(appCredentials),
        /* DAILY VALUES */
        getDailyValues: getDailyValues(appCredentials),
        /* PROJECTIONS */
        getProjection: getProjection(appCredentials),
        /* BANK ACCOUNTS */
        listBankAccounts: listBankAccounts(appCredentials),
        /* DEPOSITS */
        createDeposit: createDeposit(appCredentials),
        listDeposits: listDeposits(appCredentials),
        getDeposits: getDeposits(appCredentials),
      };
    } else {
      console.log("Credentials:", appCredentials);
      throw new Error("Invalid Wealthsimple app credentials");
    }

  }
}
