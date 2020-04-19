import { Platform, Linking } from 'react-native'; // eslint-disable-line import/no-unresolved, max-len
//import SafariView from 'react-native-safari-view';
import * as WebBrowser from 'expo-web-browser';

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

/*
const openURL = authUrl => {
  //console.log(SafariView.isAvailable())
  //Linking.addEventListener('url',onLinkChange);
  /*return(
      SafariView.isAvailable()
      .then(() => SafariView.show({url: authUrl, fromBottom: true}))
      .catch(() => Linking.openURL(authUrl))
  )
  console.log("loading web browser")
  return(
    WebBrowser.openAuthSessionAsync(authUrl)
  )
}

export const dance = authUrl => openURL(authUrl)
.then((result) => {
    console.log("result from web browser", result);
    if(result.type == "success"){
      return result.url
    } else {
      return "cancelled"
    }
})
.catch(error => error);


*/
/*.then((result) => new Promise((resolve, reject) => {
  console.log(result);
  const handleUrl = (url) => {
    console.log("handling url");
    console.log("returning url is: ", url)
    if (!url || url.indexOf('fail') > -1) {
      reject(url);
    } else {
      resolve(url);
    }
  };

  const onLinkChange = ({ url }) => {
    console.log("redirect_url submitted", url);
    //if(Platform.OS == "ios" && SafariView.isAvailable()){
      WebBrowser.dismiss();
    //}

    Linking.removeEventListener('url', onLinkChange);
    handleUrl(url);
  };
  console.log("adding event listener")
  Linking.addEventListener('url', onLinkChange);
}));
*/
let previousOnLinkChange;

const openURL = authUrl => {
  console.log("loading web browser")
  if(Platform.OS == "ios") {
    return(
      WebBrowser.openAuthSessionAsync(authUrl)
    )
  } else {
    Linking.openURL(authUrl)
  }
}

export let dance

if(Platform.OS == "ios"){
  dance = async (authUrl) => {

    Linking.addEventListener('url',onLinkChange);
    event = await openURL(authUrl)
    console.log("result from web browser", event);
    //if(result.type == "success"){
    return event.url

    const handleUrl = url => {
      console.log("now going through handleurl")
      if(!url || url.indexOf('fail') < -1){
        return false
      } else {
        return url
      }
    }

    const onLinkChange = ({ url }) => {
      console.log("url from onlinkchange", url)
      WebBrowser.dismiss()
      Linking.removeEventListener('url',onLinkChange)
      handleUrl(url)
    }
  }
} else if (Platform.OS == "android") {
  dance = (authUrl) => {
  if (previousOnLinkChange) {
    Linking.removeEventListener('url', previousOnLinkChange);
  }

  return Linking.openURL(authUrl)
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
        previousOnLinkChange = undefined;
        handleUrl(url);
      };

      Linking.addEventListener('url', onLinkChange);

      previousOnLinkChange = onLinkChange;
    }));
};
  /*
  dance = authUrl => openURL(authUrl)
   .then(() => new Promise((resolve, reject) => {
     const handleUrl = (url) => {
       console.log("handling url");
       if (!url || url.indexOf('fail') > -1) {
         reject(url);
       } else {
         resolve(url);
       }
     };

     const onLinkChange = ({ url }) => {
       console.log("redirect_url submitted", url);
       Linking.removeEventListener('url', onLinkChange);
       handleUrl(url);
     };
     console.log("adding event listener")
     Linking.addEventListener('url', onLinkChange);
  })) */

}


export const request = fetch;
