var express = require('express');
var routes = require('./routes');
var app = express();
var port = 1919;
app.set('view engine', 'ejs');
var csv = require('ya-csv');

// *****************************************************************************
// ******* Parse the CSV into transaction entries. *****************************
// *****************************************************************************

monthEntries = {total:{debit:0, credit:0}};

i = 0;

// Read the entries for a month.
// TODO : Iterate through all files.
var file = 'files/2015-02-Februarie.csv';
var reader = csv.createCsvFileReader(file);
var entry = {date:'', details:'', debit:0, credit:0};
header = ['Details', 'Credit', 'Debit'];

reader.addListener('data', function(data) {
  var date = data[0];
  var debit = parseFloat(data[2].replace('.','').replace(',','.'));
  var credit = parseFloat(data[3].replace('.','').replace(',','.'));

  if (date.length && i > 0) {
    if (typeof transaction != 'undefined') {
      generate_transaction_entry(transaction);
    }
    transaction = {
      day: parseInt(date.substring(0, 2)),
      date: date,
      details: data[1],
      debit: (isNaN(debit) ? 0: debit),
      credit: (isNaN(credit) ? 0: credit),
    };
  }
  else if (typeof transaction != 'undefined') {
    transaction.details += "<br>" + data[1];
  }

  i++;
});

function generate_transaction_entry(transaction) {
  if (typeof monthEntries[transaction.day] == 'undefined') {
    monthEntries[transaction.day] = {transactions:[], total:{credit:0, debit:0}};
  }
  monthEntries[transaction.day].transactions.push(transaction);
  var total = getDayTransactionsTotal(transaction);
}

function getDayTransactionsTotal(transaction) {
  if (Object.keys(monthEntries).length == 0) {
    return false;
  }
  var day = transaction.day;
  monthEntries.total.credit += parseFloat(transaction.credit);
  monthEntries.total.debit += parseFloat(transaction.debit);
  monthEntries[day].total.credit += parseFloat(transaction.credit);
  monthEntries[day].total.debit += parseFloat(transaction.debit);
}

// *****************************************************************************
// *****************************************************************************
// *****************************************************************************

app.use(express.static(__dirname + '/views/css'));
app.use(express.static(__dirname + '/views/js'));
// Set locals vars (available throughout the app)
app.locals.pagetitle = "ING Parser";

// Home.
app.get('/', routes.index);

// Home.
app.get('/json', routes.json);

// 404 route.
app.get('*', routes.notFound);

var server = app.listen(port, function() {
  console.log('Listening on port ' + port);
});
