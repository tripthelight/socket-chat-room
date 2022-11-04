/**
 * RENDOM NAME
*/
let randomName = (lenth) => {
  let text = '';
  // let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`{}[]:;<>?,./|";
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for( let i=0; i < lenth; i++ ) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

module.exports = {randomName};
