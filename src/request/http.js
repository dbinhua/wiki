import axios from 'axios'
import qs from 'qs'
import store from '@/store/index'

if (process.env.NODE_ENV == 'development'){
  axios.defaults.baseURL = 'dev'
}else if (process.env.NODE_ENV == 'debug'){
  axios.defaults.baseURL = 'debug'
}else if (process.env.NODE_ENV == 'pro'){
  axios.defaults.baseURL = 'pro'
}

axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

