/**
 * Login with various social API's.
 * Including: Google, Twitter, Facebook, Instagram, Tumblr & LinkedIn.
 */

import { __ } from 'ramda';
import login from './lib/login';
import * as platform from './lib/platforms/react-native';
import * as _klemi from './lib/providers/klemi';
import * as _klemi_dev from './lib/providers/klemi_dev';

export const klemi = login(_klemi, platform);
export const klemi_dev = login(_klemi_dev, platform);

export default login(__, platform);
