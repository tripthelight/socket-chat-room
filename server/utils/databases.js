const fs = require('fs');
const json = require('./../databases/taptap.json');

const loadJSON = (filename = '') => JSON.parse(fs.existsSync(filename)?fs.readFileSync(filename).toString():'null');
const saveJSON = (filename = '', json = 'null') => fs.writeFileSync(filename, JSON.stringify(json));
// const data = loadJSON('./server/databases/taptap.json');
// data.forEach(item => {
//   item.name = '333';
//   item.state = 'false';
// });
// data.push({"name":"room4", "state":"false"});
// saveJSON('./server/databases/taptap.json', data);

const fsObject = {
  loadJSON: loadJSON,
  saveJSON: saveJSON,
}

module.exports = fsObject;
