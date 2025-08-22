function toggle(id){
    console.log("working");
    var style = document.getElementById(id).style;
    
    console.log(id+" "+style.height);
    if (style.height == '1000px' )
        style.height = '0px';
    else  
        style.height = '1000px';
    console.log(id+" "+style.height);
    // window.scrollTo({
    //     top: 100,
    //     left: 100,
    //     behavior: "smooth",
    // });
}

var holdInterval;
function up(){
    holdInterval = setInterval(function(){
        move(-4);
    },1)
}
function down(){
    holdInterval = setInterval(function(){
        move(4);
    },1)
}
function stop(){
    clearInterval(holdInterval);
}


function move(val){
    window.scrollBy({
        top: val,
        left: 0,
        behavior: "smooth",
    });
}

var w = window.innerWidth/2; // arbitrary value representing the distance between the user and the screen
var eyeRadius = 75;
var minZDistance = w+eyeRadius+300;
var maxZDistance = minZDistance+w;
var maxYDistance = 500;
var maxEyeOpacity = 1;
var eyeLidHeight = 375;
var eyeLidMinHeight = 330;

var eyeCon = document.getElementById("eye-generator");

var eyeList = [];
var eyeYList = [];
var eyeScaleList = [];
var pupilList = [];
var eyelidTopList = [];
var eyelidBotList = [];
var pageX = window.innerWidth/2; // global mouse coordiates, defaults to middle of screen
var pageY = window.innerHeight/2;
var lastScrollPos = 0;

function generateEye(){
    //console.log("called")
    var eye = document.createElement("div");
    eye.classList.add("eye-container");
    var pupil = document.createElement("div");  
    pupil.classList.add("pupil");
    eye.appendChild(pupil);

    var eyeLidTop = document.createElement("img");
    eyeLidTop.classList.add("eye-lid");
    eyeLidTop.src = "arch.webp";
    eye.appendChild(eyeLidTop);

    var eyeLidBot = document.createElement("img");
    eyeLidBot.classList.add("eye-lid");
    eyeLidBot.src = "arch.webp";
    eyeLidBot.style.rotate = "180deg";
    eye.appendChild(eyeLidBot);
    

    var distance = minZDistance + Math.random() * maxZDistance;
    eye.style.zIndex = -Math.round(distance);
    var scale =  w/distance;
    eye.style.scale = scale;
    //console.log(eye.style.getPropertyValue('--parallax-speed'));
    var y = (Math.random()-.5)*maxYDistance
    eye.style.top = y+"px";
    eye.style.left = Math.random()*100+"%";


    eyeCon.appendChild(eye);
    eyeList.push(eye);
    eyeYList.push(y);
    eyeScaleList.push(scale);
    pupilList.push(pupil);
    eyelidTopList.push(eyeLidTop);
    eyelidBotList.push(eyeLidBot);
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + rect.height / 2 + window.scrollY
    };
}


function update(){
    var scrollDelta = window.scrollY - lastScrollPos;
    pageY += scrollDelta;
    lastScrollPos = window.scrollY;

    var start = window.scrollY;
    var end = start + window.innerHeight;
    for (let i = 0; i < eyeList.length; i++){
        moveEyes(i,scrollDelta);
        var off = getOffset(eyeList[i]);
        if (start < off.y && end > off.y){
            movePupils(i);
            setEyeVis(i);
        }
        
    }
}
function moveEyes(eyeId, scrollDelta){
    var eye = eyeList[eyeId];
    var y = eyeYList[eyeId];
    var scale = eyeScaleList[eyeId];

    y -= scrollDelta * (scale);
    eye.style.top = y + "px";

    eyeYList[eyeId] = y;
    
}


function setEyeVis(eyeId){
    var eye = eyeList[eyeId];
    //var x = pageX-getOffset(eye).left;
    var y = pageY-getOffset(eye).y;
    //var len = Math.sqrt(x*x+y*y);

    var yPercent = y / window.innerHeight;
    eye.style.opacity = maxEyeOpacity*(1.4+eye.style.zIndex/maxZDistance)-Math.abs(yPercent) * .2;

    var heightDelta = (eyeLidHeight-eyeLidMinHeight);
    var openAmt = (yPercent*yPercent)*heightDelta+eyeLidMinHeight;
    var sum = Math.min(-eyeLidHeight+openAmt,0);
    var eyeLidOffset = "0 "+sum+"px";
    //console.log(yPercent);
    var eyeLidTop = eyelidTopList[eyeId];
    var eyeLidBot = eyelidBotList[eyeId];
    eyeLidTop.style.setProperty("object-position",eyeLidOffset);
    eyeLidBot.style.setProperty("object-position",eyeLidOffset);
    
}

function mul(vec3, scale){
    return {x: vec3.x*scale, y: vec3.y*scale, z: vec3.z*scale};
}
function dot(a, b){
    return a.x*b.x + a.y*b.y + a.z*b.z;
}
function angleTo(a,b){
    return Math.acos(dot(a, b)/length(a)/length(b));
}
function add(a, b){
    return {x: a.x+b.x, y: a.y+b.y, z: a.z+b.z};
}
function sub(a, b){
    return {x: a.x-b.x, y: a.y-b.y, z: a.z-b.z};
}
function length(vec3){
    return Math.sqrt(vec3.x*vec3.x+vec3.y*vec3.y+vec3.z*vec3.z);
}
function normalize(vec3){
    return mul(vec3, 1/length(vec3));
}


function movePupils(eyeId){
    //console.log("called move pupils");
    var mousePos = {x: pageX, y: pageY, z: w}
    var eye = eyeList[eyeId];
    var pupil = pupilList[eyeId];
    var eyeScale = eyeScaleList[eyeId];
    
    var eyeScreenPos = getOffset(eye); // the pupils position on the screen plane
    var eyePos = {x: eyeScreenPos.x, y: eyeScreenPos.y, z: w};
    //console.log(pos.x+" "+pos.y+" "+pos.z+" "+(eye.style.zIndex));
    eyePos = mul(eyePos, -eye.style.zIndex / w); // the object position without "perspective" applied
        
    var dir = normalize(sub(mousePos, eyePos));
    //pupil.style.transform = "scale(1,.5)";
    //console.log(sub(mousePos, eyeScreenPos));
    //console.log(eyePos);
        
        
    var pupilPos = add(eyePos, mul(dir, eyeRadius));
    //console.log(pupilPos.x+" "+pupilPos.y);
    var pupilScreenPos = mul(pupilPos, w / pupilPos.z);
    var pupilDistance = length(sub(pupilScreenPos, {x: eyeScreenPos.x, y: eyeScreenPos.y, z: w}));
    if (pupilDistance > eyeRadius * eyeScale){
        //console.log("CALLED");
        pupilScreenPos = add(eyeScreenPos, mul(sub(pupilScreenPos, eyeScreenPos), eyeRadius));
    }
    pupil.style.left = (pupilScreenPos.x-eyeScreenPos.x)+"px";
    pupil.style.top = (pupilScreenPos.y-eyeScreenPos.y)+"px";
    pupil.style.transform = "scale(1,"+Math.cos(pupilDistance/eyeRadius*Math.PI/2)+")";
    //console.log(dir);

    var flatDir = normalize(sub(mousePos, {x: eyeScreenPos.x, y:eyeScreenPos.y, z:w}));
    //console.log(flatDir);
    var angle = angleTo(flatDir, {x:0, y:-1, z: 0});
    if (flatDir.x < 0)
        angle = 2 * Math.PI - angle;
    //console.log(angle);
    pupil.style.rotate = angle+"rad";
        // console.log(eyeScreenPos.x+" "+eyeScreenPos.y+" "+w+" eye");
        // console.log(pupilScreenPos.x+" "+pupilScreenPos.y+" "+pupilScreenPos.z+" pupil");
        // console.log((pupilScreenPos.x-eyeScreenPos.x)/eyeRadius+" "+(pupilScreenPos.x-eyeScreenPos.x)/eyeRadius+" percent");

        // var len = Math.sqrt(x*x+y*y);
        // x /= len;
        // y /= len;

        // var max = 50;
        // var percent = Math.min(1,len/max);

        // x *= 25 * percent;
        // y *= 25 * percent;

        // pupil.style.left = x+"%";
        // pupil.style.top = y+"%";
        //console.log(x+" "+y);
    
}

for (let i = 0; i < 50; i++)
    generateEye();

addEventListener("mousemove", (event)=>{
    pageX = event.pageX;
    pageY = event.pageY;
});

addEventListener("mousemove", update);
addEventListener("scroll", update);

var spinList = document.getElementsByClassName("spin");
for (var i = 0; i < spinList.length; i++){
    var style = spinList[i].style;
    style.setProperty("animation-delay",-1000*Math.random()+"s");
}

