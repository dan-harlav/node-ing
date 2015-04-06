exports.index = function(req, res) {
  var params = [];
  params.title = 'ING Analysis';
  // params.header = header;
  // params.monthEntries = monthEntries;

  res.render('default', params);
  // res.json(allEntries);
  // res.status(404);
};

exports.json = function(req, res) {
  var params = [];
  params.title = 'ING Analysis';
  // params.csv_raw_data = csv_raw_data;
  // params.monthEntries = monthEntries;

  // res.render('default', params);
  res.json(monthEntries);
  // res.status(404);
};

exports.notFound = function(req, res) {
  res.status(404);
  res.send('404 Not Found Bitch');
};
