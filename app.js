var express = require('express');
var routes = require('./routes');

var fs = require('fs');
var path = require("path");

var app = express();
var port = 1919;

app.set('view engine', 'ejs');
var csv = require('ya-csv');

var moment = require('moment');
moment.locale('ro', {
  months: 'Ianuarie_Februarie_Martie_Aprilie_Mai_Iunie_Iulie_August_Septembrie_Octombrie_Noiembrie_Decembrie'.split('_'),
  monthsShort: 'Ian_Feb_Mar_Apr_Mai_Iun_Iul_Aug_Sep_Oct_Noi_Dec'.split('_')
});

// *****************************************************************************
// ******* Parse the CSV into transaction entries. *****************************
// *****************************************************************************

var dir = "files/"
fs.readdir(dir, function (err, files) {
    if (err) {
        throw err;
    }
    files.map(function (file) {
        return path.join(dir, file);
    }).filter(function (file) {
        return fs.statSync(file).isFile();
    }).forEach(function (file) {
      generate_month_entry(file);
    });
});

function generate_month_entry(file) {
  if (path.extname(file) != '.csv') {
    return;
  }
  var filename = path.basename(file);
  var datestring = filename.substr(0, filename.lastIndexOf('.'));
  moment.locale('ro');
  var d = new Date(datestring);
  var year = moment(d).format('YYYY');
  var month = moment(d).format('MM');
  var monthname = moment(d).format('MMMM');
  console.log(monthname);

  monthEntries = {total:{debit:0, credit:0}};
  i = 0;
  // Read the entries for a month.
  if (fs.existsSync(file)) {
    var reader = csv.createCsvFileReader(file);

    var entry = {date:'', details:'', debit:0, credit:0};
    header = ['Details', 'Credit', 'Debit'];

    reader.addListener('data', function(data) {
      var date = data[0];
      var debit = (typeof data[2] != 'undefined') ? parseFloat(data[2].replace('.','').replace(',','.')): data[2];
      var credit = (typeof data[3] != 'undefined') ? parseFloat(data[3].replace('.','').replace(',','.')): data[3];

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
  }
  else {
    error = {message:"No file found"};
  }
}

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
