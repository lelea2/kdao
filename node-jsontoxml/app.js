var jsonxml = require('jsontoxml');

var data = {
    node:'text content',
    parent:[
        {name:'taco',text:'beef taco',children:{salsa:'hot!'}},
        {name:'taco',text:'fish taco',attrs:{mood:'sad'},children:[
            {name:'salsa',text:'mild'},
            'hi',
            {name:'salsa',text:'weak',attrs:{type:2}}
        ]},
        {name:'taco',attrs:'mood="party!"'}
    ],
    parent2:{
        hi:'is a nice thing to say',
        node:'i am another not special child node',
        date: function(){
            return (new Date())+'';
        }
    }
};

var data2 = {
    doc: {
        Sale: {
            SaleGUID: 'FE90EA17-4CE0- 4E68-B5BD- B178D3B7560E',
            ListingGUID: 'C18190D6-D5B6- 466B-8C91- 50B031C9EFC3',
            Buyer1GUID: '08CF4E2F-1FC7- 4C4D-A799- 48CEB5E2D882',
            ListingOfficeGUID: '296FD5F6-D85D- 4700-A939- 942FA0193D4D',
            AcceptanceDate: '2013-06- 01',
            EstimatedClosingDate: '2013-09- 01',
            Remarks: 'Coop Broker: Remax Affiliates',
            SalePrice: 125000,
            SaleSource: 'Website'
        }
    }
};

var xml = jsonxml(data);
console.log(xml);

var xml2 = jsonxml(data2);
console.log(xml2);

var xmlCData = jsonxml.cdata(jsonxml(data2));
console.log(xmlCData);

