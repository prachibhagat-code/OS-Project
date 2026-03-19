let processes=[];

function addProcess(){

let pid=document.getElementById("pid").value;
let arrival=parseInt(document.getElementById("arrival").value);
let burst=parseInt(document.getElementById("burst").value);
let priority=parseInt(document.getElementById("priority").value);

processes.push({pid,arrival,burst,priority});

updateTable();

}

function loadExample(){

processes=[
{pid:"P1",arrival:0,burst:5,priority:2},
{pid:"P2",arrival:1,burst:3,priority:1},
{pid:"P3",arrival:2,burst:8,priority:4},
{pid:"P4",arrival:3,burst:6,priority:3}
];

updateTable();

}

function updateTable(){

let table=document.getElementById("processTable");

table.innerHTML=`
<tr>
<th>PID</th>
<th>Arrival</th>
<th>Burst</th>
<th>Priority</th>
</tr>
`;

processes.forEach(p=>{

table.innerHTML+=`
<tr>
<td>${p.pid}</td>
<td>${p.arrival}</td>
<td>${p.burst}</td>
<td>${p.priority}</td>
</tr>
`;

});

}

function runScheduling(){

let algo=document.getElementById("algorithm").value;

if(algo==="fcfs") calculate([...processes].sort((a,b)=>a.arrival-b.arrival));

if(algo==="sjf") calculate([...processes].sort((a,b)=>a.burst-b.burst));

if(algo==="priority") calculate([...processes].sort((a,b)=>a.priority-b.priority));

if(algo==="rr") roundRobin();

}

function calculate(list){

let time=0;

let gantt="";
let timeline="";

let totalWT=0;
let totalTAT=0;

timeline+=`<div class="time">0</div>`;

list.forEach(p=>{

let start=Math.max(time,p.arrival);

let finish=start+p.burst;

let wt=start-p.arrival;

let tat=finish-p.arrival;

totalWT+=wt;
totalTAT+=tat;

gantt+=`<div class="block">${p.pid}</div>`;

time=finish;

timeline+=`<div class="time">${time}</div>`;

});

showResult(gantt,timeline,totalWT,totalTAT);

}

function roundRobin(){

let q=parseInt(document.getElementById("quantum").value);

let queue=[...processes];

let time=0;

let gantt="";
let timeline="";

let totalWT=0;
let totalTAT=0;

queue.forEach(p=>p.remaining=p.burst);

timeline+=`<div class="time">0</div>`;

while(queue.some(p=>p.remaining>0)){

for(let p of queue){

if(p.remaining>0){

let exec=Math.min(q,p.remaining);

gantt+=`<div class="block">${p.pid}</div>`;

time+=exec;

timeline+=`<div class="time">${time}</div>`;

p.remaining-=exec;

if(p.remaining===0){

let tat=time-p.arrival;

let wt=tat-p.burst;

totalWT+=wt;

totalTAT+=tat;

}

}

}

}

showResult(gantt,timeline,totalWT,totalTAT);

}

function showResult(gantt,timeline,wt,tat){

document.getElementById("gantt").innerHTML=gantt;

document.getElementById("timeline").innerHTML=timeline;

let avgWT=(wt/processes.length).toFixed(2);

let avgTAT=(tat/processes.length).toFixed(2);

document.getElementById("avgwt").innerText=avgWT;

document.getElementById("avgtat").innerText=avgTAT;

drawChart(avgWT,avgTAT);

}

function drawChart(wt,tat){

new Chart(document.getElementById("chart"),{

type:"bar",

data:{
labels:["Waiting Time","Turnaround Time"],
datasets:[{
label:"Average Time",
data:[wt,tat]
}]
}

});

}

function resetData(){

processes=[];

updateTable();

document.getElementById("gantt").innerHTML="";
document.getElementById("timeline").innerHTML="";
document.getElementById("avgwt").innerText="";
document.getElementById("avgtat").innerText="";

}