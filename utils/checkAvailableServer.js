const axios = require('axios').default;

const slaves = process.env.SLAVE_IPS.split(',').filter(IP => IP !== '');
// 35.190.201.121

console.log(slaves);

const checkAvailableServer = () => new Promise(async(resolve, reject) => {
    let index = 0;

    let isAvailable = false;
    
    while(isAvailable === false){
        let response;

        if(index === slaves.length){
            index = 0;
        }

        try {
            response = await axios.get(`${slaves[index]}/isAvailable`)
        } catch (error) {
            console.log(error.message);
        }

        if(response && response.data.data.isAvailable === true)
        {
            isAvailable = (slaves[index]);
            break;
        }

        index += 1;
    }

    resolve(isAvailable);
});

module.exports = checkAvailableServer;