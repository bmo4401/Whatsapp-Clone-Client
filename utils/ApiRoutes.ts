const HOST = process.env.NEXT_PUBLIC_API_URL;

const AUTH_ROUTE = `${HOST}/api/v1/auth`;
const MESSAGE_ROUTE = `${HOST}/api/v1/message`;
/* AUTH */
export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check`;
export const REFRESH_USER_ROUTE = `${AUTH_ROUTE}/refresh`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/register`;
export const GET_ALL_CONTACTS = `${AUTH_ROUTE}/get-contacts`;
export const GET_CALL_TOKEN = `${AUTH_ROUTE}/generate-token`;
/* MESSAGE */

export const ADD_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-message`;
export const GET_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/get-message`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-audio-message`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGE_ROUTE}/get-initial-contacts`;
