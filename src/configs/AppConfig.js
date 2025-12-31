import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from '../constants/ThemeConstant';
import { env } from './EnvironmentConfig'

export const APP_NAME = 'Civiglio';
export const API_BASE_URL = env.API_ENDPOINT_URL
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const APP_PUBLIC_PATH = '/guide';
export const APP_ADMIN = '/admin';
export const LOGO = '/img/civiglio/logo-civiglio-200.png';

export const THEME_CONFIG = {
	navCollapsed: false,
	sideNavTheme: SIDE_NAV_LIGHT,
	locale: 'it',
	navType: NAV_TYPE_SIDE,
	topNavColor: '#3e82f7',
	headerNavColor: '#ffffff',
	mobileNav: false,
	currentTheme: 'light',
	direction: DIR_LTR,
	playAudioFile: '',
	showPlayer: false
};

export const PAYMENT_METHOD = {

}
