import {
  __,
  curry,
  has,
  identity,
  ifElse,
  invoker,
  lensProp,
  merge,
  partial,
  pipe,
  pipeP,
  prop,
  set,
} from 'ramda';
import {
  authorizationUrl,
  getHeaders,
} from '../utils/oauth2';
import {
  fromQueryString,
  toQueryString,
} from '../utils/uri';

const SCOPE = 'email profile';
const AUTH = 'http://stnicks.loc.al:3000/oauth/authorize';
const TOKEN = 'http://stnicks.loc.al:3000/oauth/token';
const ME = 'http://stnicks.loc.al:3000/sessions.json';

const checkError = ifElse(
  has('error'),
  pipe(prop('error'), curry((e) => { throw new Error(e); })),
  identity,
);

/*
const getUser = curry((request, credentials) => (
  function(){
    var headers = getHeaders(credentials.access_token);
    console.log(headers);
    console.log(request);
  }
)(credentials));
*/


const getUser = curry((request, credentials) => pipe(
  prop('access_token'),
  getHeaders,
  set(lensProp('headers'), __, {}),
  pipeP(
    partial(request, [ME]),
    invoker(0, 'json'),
    set(lensProp('user'), __, {}),
    set(lensProp('credentials'), credentials),
  ),
)(credentials));

export const authorize = ({ dance, request }, { appId, appSecret, callback }) =>
  pipeP(
    dance,
    fromQueryString,
    checkError,
    merge({ appId, appSecret, callback }),
  )(authorizationUrl(AUTH, appId, callback, SCOPE, 'code'));

export const identify = curry((request, { appId, appSecret, callback, code }) =>
  pipeP(
    partial(request, [TOKEN]),
    invoker(0, 'json'),
    checkError,
    getUser(request),
  )({
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: toQueryString({
      code,
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: callback,
      grant_type: 'authorization_code',
    }),
  }),
);
