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
const AUTH = 'https://auth.klemi.co/oauth/authorize';
const TOKEN = 'https://auth,klemi.co/oauth/token';
const ME = 'https://auth.klemi.co/session.js';

const checkError = ifElse(
  has('error'),
  pipe(prop('error'), curry((e) => { throw new Error(e); })),
  identity,
);

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

export const authorize = ({ dance, request }, { appId, callback }) =>
  pipeP(
    dance,
    fromQueryString,
    checkError,
    merge({ appId, callback }),
  )(authorizationUrl(AUTH, appId, callback, SCOPE, 'code'));

export const identify = curry((request, { appId, callback, code }) =>
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
      redirect_uri: callback,
      grant_type: 'authorization_code',
    }),
  }),
);