var prompt = require('prompt');
var fs = require("fs");
var crypto = require('crypto');
const momentRandom = require('moment-random');

const sampleData = {
    "surveyId": "surveyId1",
    "surveyDate": "2019-05-01T15:00:00.000Z",
    "hospital": "Atlas Health",
    "facility" : "New Jersey Clinic",
    "countryIsoCode": "US",
    "countryName": "United States",
    "state": "New Jersey",
    "city": "Newark",
    "department": "Cardiology",
    "provider": "Francisco B Clay",
    "status": "confirm",
    "question": "How long did have to wait?",
    "answer": "30"
  };

const departments = []
const status = ["confirmed", "cancelled", "no-show", "pending", "awarded"]
const statusForPending = ["confirmed", "cancelled"]

var finalObj = {};
var finalList =[];
var totalsurveys= 0;
var prevList = [];
var prevPendingList = [];
var subPrevPendingList = [];
var remainingPendingList = [];
var checkIds = [];
var json ='';
var output_file = '';
var surveyCount = '';
var start_date = '';
var end_date = '';
var hospitals;


var result = {"surveyCount":"1", "start_date":"2019-01-01", "end_date":"2019-01-10", "output_file":"temp.json"}
generateSurveys(result);


/*
prompt.start();
prompt.get([
    {
        description: "Enter no of surveys to generate",
        name: 'surveyCount',
        required: true,
        type: ' integer',
        message: 'Please enter valid number'
    },
    {
        name: 'start_date',
        required: true,
        pattern: /^\d{4}\-\d{1,2}\-\d{1,2}$/,
        description: "Enter the start date in the format YYYY-MM-DD"
    },
    {
        name: 'end_date',
        required: true,
        pattern: /^\d{4}\-\d{1,2}\-\d{1,2}$/,
        description: "Enter the end date in the format YYYY-MM-DD"
    },
    {
        name: 'output_file',
        required: true,
        description: "Enter the output file in the format filename.json"
    },
], function (err, result) {
    if (err) { return onErr(err); }
      generateSurveys(result);
});
*/
function generateSurveys(result){
    if (result.start_date == result.end_date) {
        start_date = new Date(result.start_date);
        end_date = new Date(result.start_date);
    }
    else {
        start_date = new Date(result.start_date);
        end_date = new Date(result.end_date);
    }
  
    surveyCount = result.surveyCount;
    output_file = result.output_file;

    console.log("----------------------");
    console.log("Input params");
    console.log("----------------------");
    console.log("surveyCount: "+surveyCount+"\nstart_date: "+start_date+"\nend_date: "+end_date+"\noutput_file: "+output_file);
    console.log("Hash: "+getHash(start_date+surveyCount+end_date+output_file));
    console.log("----------------------");

    
    //Read hospitals
    let hospitals = JSON.parse(fs.readFileSync('hospitals.json', 'utf-8'));
    
    for(i=1; i <= surveyCount; i++){
        var sdate = randomDate(end_date, start_date);
        var h = randomElementFromJson(hospitals);
        var f = randomElementFromJson(h.hospital.facility);
        var d = randomElementFromJson(f.departments);
        //console.log("Hospital: "+h.hospital.name+", facility: "+f.name + ", Dept: "+d.name);

        //console.log(i+"\t -Survey - "+getHash(i+sdate)+", hospital: "+h.hospital.name+", dept: "+dept+" date: "+sdate);        
    }

}

function onErr(err) {
    console.log(err);
    return 1;
}

//Utility functions
function randomElementFromJson(jsonarray){
    var obj_keys = Object.keys(jsonarray);
    var ran_key = obj_keys[Math.floor(Math.random() *obj_keys.length)];
    var element = jsonarray[ran_key];
    return element;
}

function getHash(t){
    return  crypto.createHash('md5').update(t).digest('hex');
}

function getTimeline(department,hospital){
    var result = {
        "startHours":8,
        "endHours": 20
    };
    return result
}

function randomDate(start, end) {
    var t = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    t.setMinutes(0);
    t.setMilliseconds(0);
    return t;
  }

function convertUnixToTimeFormat(unixTime){

}

