/**
 * Created by kimtaehyun on 2017. 9. 19..
 */

var util = require('../_public/js/synctechno.util');



var obj = {
  'a': '',
  'b': {
    'b-1': 'bbbb'
  },
  'null': null,
  'undefined': undefined,
  'string': 'string',
  'int': 0,
  'obj': {
    'null-obj': null,
    'str-obj': 'string'
  },
  'nest': {}
};


var testFunction = global.ST_SafeSet;
var testGetFunction = global.ST_SafeGet;

try {
  testFunction(obj, ['b', 'c--', 'd'], 'ddd');
  console.log( "1 ", JSON.stringify(obj, null, 2 ) );


  testFunction(obj, ['e:e'], 'eee');
  console.log( "2 ", JSON.stringify(obj, null, 2 ) );
  ;


  testFunction(obj.nest, ['f', 'b-1'], 'set undefined');
  console.log( "3 ", JSON.stringify(obj, null, 2 ) );


  console.log( testGetFunction(obj, ['obj', 'null-obj'], 'DEF ooo'))
  console.log( testGetFunction(obj, 'obj.null-obj', 'DEF ooo'))
  console.log( testGetFunction(obj, ['null'], 'ooo'))
  console.log( testGetFunction(obj, ['undefined'], 'ooo'))
  console.log( testGetFunction(obj, ['undefined']))
  console.log( testGetFunction(obj, ['aaaaaaa'], 'ooo'))

}
catch( ex ) {
  console.log( ex );
}

