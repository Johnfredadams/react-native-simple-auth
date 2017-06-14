import { Linking } from 'react-native'; // eslint-disable-line import/no-unresolved, max-len
import SafariView from 'react-native-safari-view';

/*
export const dance = authUrl => Linking.openURL(authUrl)
  .then(() => new Promise((resolve, reject) => {
    const handleUrl = (url) => {
      if (!url || url.indexOf('fail') > -1) {
        reject(url);
      } else {
        resolve(url);
      }
    };

    const onLinkChange = ({ url }) => {
      Linking.removeEventListener('url', onLinkChange);
      handleUrl(url);
    };

    Linking.addEventListener('url', onLinkChange);
  }));
  */

/*
const onLinkChange = ({ url }) => {
      console.log("something happened");
      if(SafariView.isAvailable()){
        SafariView.dismiss();
      }
      Linking.removeEventListener('url', onLinkChange);
      handleUrl(url);
};

const handleUrl = (url) => {
  new Promise((resolve,reject) => {
    if (!url || url.indexOf('fail') > -1) {
      reject(url);
    } else {
      resolve(url);
    }
  })
}
*/
const openURL = authUrl => {
  //console.log(SafariView.isAvailable())
  //Linking.addEventListener('url',onLinkChange);
  return(
      SafariView.isAvailable()
      .then(() => SafariView.show({url: authUrl, fromBottom: true}))
      .catch(() => Linking.openURL(authUrl))
  )
}

export const dance = authUrl => openURL(authUrl)
.then(() => new Promise((resolve, reject) => {
  const handleUrl = (url) => {
    if (!url || url.indexOf('fail') > -1) {
      reject(url);
    } else {
      resolve(url);
    }
  };

  const onLinkChange = ({ url }) => {
    if(SafariView.isAvailable()){
      SafariView.dismiss();
    }
    Linking.removeEventListener('url', onLinkChange);
    handleUrl(url);
  };

  Linking.addEventListener('url', onLinkChange);
}));



export const request = fetch;
