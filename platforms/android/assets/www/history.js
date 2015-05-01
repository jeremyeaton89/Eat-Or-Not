function History() {};

History.prototype.setReferrerHash = function(hash) {
  if (!hash) hash = '/';
  History.prototype.hash = hash;
  window.hash = hash;
}

History.prototype.getReferrerHash = function() {
  if (History.prototype.hash) {
    return History.prototype.hash;
  } else { 
    console.log('No hash history. Returning "/".');
    return '/';
  }
}

module.exports = new History();
