import axios from 'axios'

export default axios.create({
    baseURL: 'https://demo.udiseplus.gov.in/archive-services',
    headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization": "Bearer df;lkjz8lke4lk345kljsdfkjdfgkljsf08994a/sdfljsdf879w4ra/sdflksdflksdf",
        "Identity":"test"
    }
})