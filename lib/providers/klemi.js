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
const TOKEN = 'https://auth.klemi.co/oauth/token';
const ME = 'https://auth.klemi.co/sessions.json';

const getMeUrl = function(tenant){
  //console.log("getMeUrl", tenant)
  return ME.replace("auth",tenant)
}

const checkError = ifElse(
  has('error'),
  pipe(prop('error'), curry((e) => { throw new Error(e); })),
  identity,
);

const returnSelf = function(arg){
  console.log("return self:",arg);
  return arg;
}
const returnSelfPromise = function(arg){
  console.log("return self promise", arg);
  return new Promise((resolve,reject) => resolve(arg));
}
const addKlemiTenant = curry((klemi_tenant,credentials) => {
  //console.log("add klemi tenant = tenant:",klemi_tenant);
  //console.log("add klemi tenant = credentials:",credentials);
  //console.log("add klemi tenant:",klemi_tenant);
  credentials.klemi_tenant = klemi_tenant
  return new Promise((resolve,reject) => resolve(credentials));
})
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
    partial(request, [getMeUrl(credentials.klemi_tenant)]),
    invoker(0, 'json'),
    set(lensProp('user'), __, {}),
    set(lensProp('credentials'), credentials),
  ),
)(credentials));

export const authorize = ({ dance, request }, { appId, appSecret, callback, klemi_tenant }) =>
  pipeP(
    dance,
    fromQueryString,
    checkError,
    merge({ appId, appSecret, callback, klemi_tenant }),
  )(authorizationUrl(AUTH, appId, callback, SCOPE, 'code'));

export const identify = curry((request, { appId, appSecret, callback, klemi_tenant, code }) =>
  pipeP(
    partial(request, [TOKEN]),
    invoker(0, 'json'),
    checkError,
    addKlemiTenant(klemi_tenant),
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
