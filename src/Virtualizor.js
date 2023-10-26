const axios = require('axios')

class Virtualizor {
    /**
     * Define Virtualizor Instance
     * 
     * @param {string}  api     url virtualizor client panel
     * @param {string}  key     api key virtualizor
     * @param {string}  secret  api password virtualizor
     * @param {boolean} raw     return data with raw or not
     */
    constructor({
        api,
        key,
        secret,
        raw
    }) {
        this.api = api
        this.key = key
        this.secret = secret
        this.raw = raw ? raw : false
    }

    /**
     * Get VPS Details by VPS ID
     * 
     * @param {id}  id  vps id from provider
     * 
     * @returns {json}  return response from rest api with raw or not 
     */
    getvps(id) {
        const buildUrl = `${this.api}/index.php`

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'vpsmanage',
                    svs: id,
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret
                }
            })
                .then((res) => {
                    return res.data
                })
                .then((res) => {

                    let resData = res

                    if (!this.raw) {
                        resData = {
                            ip: res.info.ip,
                            hostname: res.info.hostname,
                            status: res.info.status,
                            os: res.info.vps.os_name,
                            cores: res.info.vps.cores,
                            ram: res.info.vps.ram,
                            space: res.info.vps.space,
                            bandwidth: {
                                limit: res.info.bandwidth.limit,
                                used: res.info.bandwidth.used,
                                free: res.info.bandwidth.free,
                            },
                            datacenter: res.info.server_name,
                        }
                    }

                    resolve(resData)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    /**
 * List VPS
 * 
 * @returns {json}  return response from rest api with raw or not 
 */
    listvps() {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'listvs',  // Make sure this action is correct according to your API
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret
                }
            })
                .then((res) => {
                    let resData = res.data;

                    if (!this.raw && res.data.vs) {
                        resData = Object.keys(res.data.vs).reduce((acc, key) => {
                            const vps = res.data.vs[key];
                            // Basic check to ensure it's a valid VPS entry
                            if (vps && vps.vpsid && vps.hostname && vps.os_name) {
                                acc.push({
                                    id: vps.vpsid,
                                    name: vps.vps_name,
                                    hostname: vps.hostname,
                                    os: vps.os_name,
                                    cores: vps.cores,
                                    ram: vps.ram,
                                    space: vps.space,
                                    bandwidth: vps.bandwidth,
                                    serverName: vps.server_name,
                                    status: vps.status,
                                    ip: vps.ips
                                });
                            }
                            return acc;
                        }, []);
                    }

                    resolve(resData);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    /**
 * Start VPS by ID
 * 
 * @param {id}  id  vps id from provider
 * 
 * @returns {json}  return response from rest api with raw or not 
 */

    startVPS(vpsId) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'start',
                    do: 1,
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const data = response.data;
                    resolve({
                        message: data.done && data.done.msg,
                        time_taken: data.time_taken,
                        vpsid: data.vpsid
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    /**
* Stop VPS by ID
* 
* @param {id}  id  vps id from provider
* 
* @returns {json}  return response from rest api with raw or not 
*/

    stopVPS(vpsId) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'stop',
                    do: 1,
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const data = response.data;
                    resolve({
                        message: data.done && data.done.msg,
                        time_taken: data.time_taken,
                        vpsid: data.vpsid
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    /**
* Restart VPS by ID
* 
* @param {id}  id  vps id from provider
* 
* @returns {json}  return response from rest api with raw or not 
*/

    restartVPS(vpsId) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'restart',
                    do: 1,
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const data = response.data;
                    resolve({
                        message: data.done && data.done.msg,
                        time_taken: data.time_taken,
                        vpsid: data.vpsid
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /**
* Get VPS RAM by ID
* 
* @param {id}  id  vps id from provider
* 
* @returns {json}  return response from rest api with raw or not 
*/

    getVPSRam(vpsId) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'ram',
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const { ram, time_taken, vpsid } = response.data;
                    resolve({ ram, time_taken, vpsid });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    /**
* Get VPS CPU by ID
* 
* @param {id}  id  vps id from provider
* 
* @returns {json}  return response from rest api with raw or not 
*/

    getVPSCpu(vpsId) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'cpu',
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const { cpu, time_taken, vpsid } = response.data;
                    resolve({ cpu, time_taken, vpsid });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    /**
* Get VPS disk by ID
* 
* @param {id}  id  vps id from provider
* 
* @returns {json}  return response from rest api with raw or not 
*/

    getVPSDisk(vpsId) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.get(buildUrl, {
                params: {
                    act: 'disk',
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const { disk, time_taken, vpsid } = response.data;
                    resolve({ disk, time_taken, vpsid });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    /**
* Get VPS bandwidth by ID
* 
* @param {id}  id  vps id from provider
* 
* @returns {json}  return response from rest api with raw or not 
*/

    getVPSBandwidth(vpsId, month) {
        const buildUrl = `${this.api}/index.php`;

        return new Promise((resolve, reject) => {
            axios.post(buildUrl, `show=${month}`, {
                params: {
                    act: 'bandwidth',
                    api: 'json',
                    apikey: this.key,
                    apipass: this.secret,
                    svs: vpsId
                }
            })
                .then(response => {
                    const { bandwidth, time_taken, vpsid } = response.data;
                    resolve({ bandwidth, time_taken, vpsid });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

}

module.exports = Virtualizor
