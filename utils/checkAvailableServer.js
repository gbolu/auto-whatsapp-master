const axios = require('axios').default;

const slaves = ['http://35.190.201.121:80']

const checkAvailableServer = () => new Promise(async(resolve, reject) => {
    let index = 0;

    let isAvailable = false;
    
    while(index < slaves.length){
        try {
            let resp1 = await axios.get(`${slaves[index]}/isAvailable`)
            if(resp1.data.data.isAvailable === true){
                isAvailable = (slaves[index]);
                break;
            }
        } catch (error) {
            console.log(error);
        }
    }

    resolve(isAvailable);
});

module.exports = checkAvailableServer;