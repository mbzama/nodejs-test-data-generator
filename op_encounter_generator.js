var prompt = require('prompt');
var fs = require("fs");
var sampleData = {"timestamp":"2018-11-18T08:15:00.000Z","encounterDate":"2018-11-18T09:00:00.000Z","encounterId":"1","status":"created","patientKey":"patient1publickey","hospital":"hospital1","department":"neurology"}
const hospitals = ['hospital1', 'hospital2','hospital3']
const hospitalsTimeline = {
    "hospital1":{
        "cardiology": {
            "startHours":7,
            "endHours": 14
        },
        "urology": {
            "startHours": 13,
            "endHours": 21
        },
        "neurology": {
            "startHours": 9,
            "endHours": 17
        }
    },
    "hospital2":{
        "cardiology": {
            "startHours":16,
            "endHours": 23
        },
        "urology": {
            "startHours": 8,
            "endHours": 16
        },
        "neurology": {
            "startHours": 5,
            "endHours": 17
        }
    },
    "hospital3":{
        "cardiology": {
            "startHours":9,
            "endHours": 18
        },
        "urology": {
            "startHours": 13,
            "endHours": 21
        },
        "neurology": {
            "startHours": 6,
            "endHours": 14
        }
    }
    }
const departments = ["cardiology", "urology", "neurology"]
const status = ["confirmed", "cancelled", "no-show", "pending", "awarded"]
const statusForPending = ["confirmed", "cancelled"]
var finalObj = {};
var finalList =[];
var totalEncounters= 0;
var prevList = [];
var prevPendingList = [];
var subPrevPendingList = [];
var remainingPendingList = [];
var checkIds = [];
var json ='';
function getTimeline(department,hospital){
    var result = {};
    Object.keys(hospitalsTimeline).forEach(function(ht) {
        if(ht == hospital){
            var dpts = hospitalsTimeline[ht]
          
            Object.keys(dpts).forEach(function(dpt) {
                if(dpt == department){
                    
                    result = dpts[dpt]
                }
        })
    }
    })
    return result
}

function getRandomHours(date,startHour, endHour) {
    var tempDate = new Date(date.getTime());
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    tempDate.setHours(hour);
    console.log(tempDate,'printing tempDate',hour)
    return tempDate;
  }

function getHours(department,hospital){
    Object.keys(hospitalsTimeline).map(key => {
        if(hospital == key){
            var v = hospitalsTimeline.key
            Object.keys(v).map(k => {
                if(department ==v.k )
                return v.k
            })
        }
    })
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntTwoNumbers(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function randInt(n, min) {
    return (Math.floor(Math.random() * n)) + (min || 0);
  }
function getRandomElements(arr, n) {
         var result = new Array(n),
             len = arr.length,
             taken = new Array(len);
         if (n > len)
             throw new RangeError("getRandom: more elements taken than available");
         while (n--) {
             var x = Math.floor(Math.random() * len);
             result[n] = arr[x in taken ? taken[x] : x];
             taken[x] = --len in taken ? taken[len] : len;
         }
         return result;
     }
function create_json(date, output_file, encounters) {

    finalObj.date = [];
    var obj = {};
   
    subPrevPendingList = getRandomElements(prevPendingList, 1>prevPendingList.length?0:getRandomIntTwoNumbers(1,prevPendingList.length))
    console.log("Sub Previous Pending List:",subPrevPendingList, "sub length", subPrevPendingList.length)
    checkIds = subPrevPendingList.map(el => el.encounterId)
    console.log("checkIds:", checkIds)
    remainingPendingList = prevPendingList.filter(el => !checkIds.includes(el.encounterId))
    console.log("Remaining Pending List:",remainingPendingList)
    for (var i = 0; i < prevPendingList.length; i++) {
        obj ={};
            obj = prevPendingList[i];
            var tempDate = new Date(date.getTime());
            console.log('Encounter Id',obj.encounterId)
            obj.encounterDate = tempDate;
            obj.status = statusForPending[Math.floor(Math.random() * statusForPending.length)];
            finalObj.date.push(obj)
            json = JSON.stringify(obj);
        fs.appendFile(output_file, json + "\r\n", function (err) {
            if (err) console.log(err);
        });
    }

    for(i=0;i<remainingPendingList;i++){
        obj ={};
        obj = remainingPendingList[i];
        var tempDate = new Date(date.getTime());
        console.log('Encounter Id',obj.encounterId)
        obj.encounterDate = tempDate;
        finalObj.date.push(obj)
        json = JSON.stringify(obj);
        fs.appendFile(output_file, json + "\r\n", function (err) {
            if (err) console.log(err);
        });
    }
    prevList = remainingPendingList.slice();
    json = "";
    if (encounters < 10) {
        var encountersVal = getRandomIntTwoNumbers(5, 10);
    }
    else {
        var encountersVal = getRandomIntTwoNumbers(10, 15)
    }
    console.log("random encunters are",encountersVal," date",date);
    for (var i = 1; i <= encountersVal; i++) {
        obj = {};
        var tempDate = new Date(date.getTime());
        console.log('Encounter Id',i,totalEncounters+i)
        obj.encounterDate = tempDate;
        obj.encounterId = totalEncounters + i;
        obj.hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
        obj.department = departments[Math.floor(Math.random() * departments.length)];
        shiftObj = getTimeline(obj.department, obj.hospital)
        console.log(shiftObj.startHours,shiftObj.endHours)
        obj.timestamp = getRandomHours(tempDate,shiftObj.startHours,shiftObj.endHours)
        obj.status =status[Math.floor(Math.random() * status.length)];
        finalObj.date.push(obj)
        console.log('Date:       ', date)
        if(obj.status == 'pending') console.log('Encounter with status pending:', obj.encounterId)
        json = JSON.stringify(obj);
        fs.appendFile(output_file, json + "\r\n", function (err) {
            if (err) console.log(err);
        });
    }

  
    totalEncounters += encountersVal
    console.log("prev list before:", prevList)
    prevPendingList = finalObj.date.filter(obj =>{ return obj.status == 'pending'})
    console.log("Previous Pending List:",prevPendingList, "length",prevPendingList.length)
    
    //console.log("Total List for a date" ,finalObj.date)
}

prompt.start();

prompt.get([
    {
        description: "Enter any integer value for encounter",
        name: 'encounters',
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
    console.log('Command-line input received:');
    if (result.start_date == result.end_date) {
        var start_date = new Date(result.start_date);
        var end_date = new Date(result.start_date);
    }
    else {
        var start_date = new Date(result.start_date);
        var end_date = new Date(result.end_date);
    }
  
    var output_file = result.output_file;
    var encounters = result.encounters;
    for (var date = start_date; date <= end_date; date.setDate(date.getDate() + 1)) {
        var tempDate = date;
        create_json(tempDate, output_file, encounters);
    }
    // console.log("Final Obj:", finalObj)
    // Object.keys(finalObj).map(function(key, index) {
    //     console.log('Printing key value', key)
    //     finalList.concat(finalObj.key)
    //  });
    //  var json = '';
    // finalList.forEach(el => json += JSON.stringify(el) + '\n' )
    // console.log("Final List:", finalList)
    // fs.appendFile(output_file, JSON.stringify(finalList), function(err){
    //     if (err) console.log(err);
    // })
});

function onErr(err) {
    console.log(err);
    return 1;
}