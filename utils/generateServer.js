const slaves = process.env.SLAVE_IPS.split(',').filter(IP => IP !== '');

const generateServer = function*(arr=[]) {
  for(let i = 0; ; i++){
    if(i == arr.length){
      i = 0;
    }
    yield arr[i];
    
  }
}

const serverGenerator = generateServer(slaves);

module.exports = serverGenerator;