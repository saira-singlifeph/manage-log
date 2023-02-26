import axios from 'axios';

const baseUrl = process.env.REACT_APP_URL;

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

export const getLogs = async() => {
    return axios({
        method: 'GET', 
        url: `${baseUrl}/logs`,
        headers, 
    })
    .then((response) => {
        return {
            success: true,
            logs: response.data
        }
    })
    .catch((error) => {
        return {
            success: false,
            logs: [],
            error
        };
    })
}

export const getLogById = async(id) => {
    return axios({
        method: 'GET', 
        url: `${baseUrl}/logs/${id}`,
        headers, 
    })
    .then((response) => {
        return {
            success: true,
            log: response.data
        }
    })
    .catch((error) => {
        return {
            success: false,
            log: null,
            error
        };
    })
}

export const deleteLogById = async(id) => {
    return axios({
        method: 'DELETE', 
        url: `${baseUrl}/logs/${id}`,
        headers, 
    })
    .then(() => {
        return { success: true }
    })
    .catch((error) => {
        return {
            success: false,
            error
        };
    })
}

export const updateLogById = async({ id, ...data}) => {
    return axios({
        method: 'PUT', 
        url: `${baseUrl}/logs/${id}`,
        headers,
        data
    })
    .then(() => {
        return { success: true }
    })
    .catch((error) => {
        return {
            success: false,
            error
        };
    })
}

export const createLog = async(data) => {
    return axios({
        method: 'POST', 
        url: `${baseUrl}/logs`,
        headers,
        data
    })
    .then((response => {
        return { 
            success: true,
            newData: response.data
         }
    }))
    .catch((error) => {
        return {
            success: false,
            error
        };
    })
}

export const queryLogs = async({ 
    level, 
    toDate = null,
    fromDate = null,
    source = null,
    queryAll = false, 
}) => {
    let queryCount = 1;
    let queryURL = `${baseUrl}/logs/query?level=${level}`;

    if (source) {
        queryCount += 1;
        queryURL = `${queryURL}&source=${source}`;
    }


    if (fromDate && toDate) {
        queryCount += 1;
        queryURL = `${queryURL}&toDate=${toDate}&fromDate=${fromDate}`;
    }

    queryURL = queryCount === 3 ? `${queryURL}&queryAll=${true}` : queryURL;
  
    return axios({
        method: 'GET', 
        url: queryURL,
        headers,
    })
    .then((response => {
        return { 
            success: true,
            result: response.data
         }
    }))
    .catch((error) => {
        return {
            success: false,
            error,
        };
    })
} 