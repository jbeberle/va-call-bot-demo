const _ = require('underscore');
const axios = require('axios');

const METHODS_THAT_ALLOW_PARAMS = ['GET'];
const contentType = 'application/json';

const doRequest = async function (method, baseUrl, endpoint, params = {}) {
  const fetchObj = {
    method,
    credentials: 'include',
  };

  if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) > -1) {
    fetchObj.headers = {
      ...fetchObj.headers,
      'Content-Type': contentType,
    };
    fetchObj.body = JSON.stringify(params);
  }
  console.log(`params = `);
  console.log(params);
  console.log(`JSON=${JSON.stringify(params)}`);
  console.log(`fetchObj = `);
  console.log(fetchObj);

  if (METHODS_THAT_ALLOW_PARAMS.indexOf(method) > -1) {
    if (_.keys(params).length > 0) {
      endpoint +=
        '?' +
        _.map(params, (val, key) => {
          if (val instanceof Array) {
            return _.map(val, (v) => {
              return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
            }).join('&');
          } else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
          }
        }).join('&');
    }
  }

  console.log(`fetching ${baseUrl}${endpoint}`);
  return fetch(`${baseUrl}${endpoint}`, fetchObj)
    .catch((error) => {
      console.log('An Error Occurred');
      console.log(error);
    })
    .then(() => console.log('Completed fetch'));
};

const call = async function (baseUrl, method, endpoint, params = {}) {
  let response;
  try {
    response = await doRequest(method, baseUrl, endpoint, params);
  } catch (networkError) {
    // networkError coming back as `AbortError` means abortController.abort() was called
    // @ts-ignore
    console.log('networkError=');
    console.log(networkError);
    if (networkError?.name === 'AbortError') {
      return;
    }
    // eslint-disable-next-line no-throw-literal
    throw { networkError: true };
  }
  console.log(`type of response = ${typeof response}`);
  console.log(response);
  return (typeof response !== 'undefined') ? await response.json() : null;
};

const post = async function (endpoint, params) {
  // return call<T>('https://va-veis-vamobile-dev.azurewebsites.us', 'POST',  endpoint, params, contentType, abortSignal)
  console.log('posting');
  return call('http://192.168.0.8:8088', 'POST', endpoint, params);
};

const getReason = (question) => {
  if(question.toLowerCase().indexOf("claim") > -1) {
    return 'Call about a Claim';
  }
  else {
    return question;
  }
}

const testPost = async function (fullName, email, branch, service, initialQuestion, claimId, claimType, claimPhase) {
  const channel = 'Chat Bot';
  const description = getReason(initialQuestion);
  const screen = '';
  const callReason = '';
  const callClaimDescription = '';

  post('/vetcall', {
    channel,
    fullName,
    description,
    email,
    service,
    branch,
    screen,
    callReason,
    callClaimDescription,
    claimId,
    claimType,
    claimPhase,
  });
};


const testGet = async function (id) {
  // return await get(`/v0/claim/v${id}`).data
  //return await get(`/v0/claim/v600246732`).then((j) => j.json());
  return await axios('http://localhost:3002/v0/claim/v600246732').then(response => response.data.data.attributes.claim_information);
}

const testGetUser = async function () {
  // return await get(`/v0/claim/v${id}`).data
  //return await get(`/v0/claim/v600246732`).then((j) => j.json());
  return await axios('http://localhost:3002/v0/user').then(response => response.data.data.attributes.profile);
}

const get = async function (endpoint, params = {} ) {
  console.log('getting');
  return await call('http://localhost:3002', 'GET', endpoint, params).then((result) => {
	  console.log(`after call: result=${result}`);
        return result;
    }).then(() => console.log("Hi"));
};



module.exports = {
  post,
  testPost,
  testGet,
  testGetUser,
};
