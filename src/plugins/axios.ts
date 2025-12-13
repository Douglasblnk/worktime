import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.pontomais.com.br/api/',
  headers: {
    'accept': 'application/json, text/plain, */*',
    'access-token': import.meta.env.VITE_ACCESS_TOKEN,
    'api-version': '2',
    'client': import.meta.env.VITE_CLIENT,
    'content-type': 'application/json',
    'token': import.meta.env.VITE_TOKEN,
    'uid': import.meta.env.VITE_UID,
    'uuid': import.meta.env.VITE_UUID,
  }
})

export default instance
