function toggle(id){
    console.log("working");
    var style = document.getElementById(id).style;
    
    console.log(id+" "+style.height);
    if (style.height == '1000px' )
        style.height = '0px';
    else  
        style.height = '1000px';
    console.log(id+" "+style.height);
}


var w = 500; // arbitrary value representing the distance between the user and the screen
var eyeRadius = 75;
var minZDistance = 575;
var maxZDistance = 1000;
var maxYDistance = 500;
var maxEyeOpacity = .7;
var eyeLidHeight = 375;
var eyeLidMinHeight = 330;

var eyeCon = document.getElementById("eye-generator");

var eyeList = [];
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
    eye.style.scale = w/distance;
    //console.log(eye.style.getPropertyValue('--parallax-speed'));
    
    eye.style.top = (Math.random()-.5)*maxYDistance+"px";
    eye.style.left = Math.random()*100+"%";


    eyeCon.appendChild(eye);
    eyeList.push(eye);
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
    pageY += window.scrollY - lastScrollPos;
    lastScrollPos = window.scrollY;
    movePupils();
    setEyeVis();
}

function setEyeVis(){
    for (let i = 0; i < eyeList.length; i++){
        var eye = eyeList[i];
        //var x = pageX-getOffset(eye).left;
        var y = pageY-getOffset(eye).y;
        //var len = Math.sqrt(x*x+y*y);

        var yPercent = y / window.innerHeight;
        eye.style.opacity = maxEyeOpacity-Math.abs(yPercent);

        var heightDelta = (eyeLidHeight-eyeLidMinHeight);
        var openAmt = (yPercent*yPercent)*heightDelta+eyeLidMinHeight;
        var sum = Math.min(-eyeLidHeight+openAmt,0);
        var eyeLidOffset = "0 "+sum+"px";
        //console.log(yPercent);
        var eyeLidTop = eyelidTopList[i];
        var eyeLidBot = eyelidBotList[i];
        eyeLidTop.style.setProperty("object-position",eyeLidOffset);
        eyeLidBot.style.setProperty("object-position",eyeLidOffset);
    }
}

function mul(vec3, scale){
    return {x: vec3.x*scale, y: vec3.y*scale, z: vec3.z*scale};
}
function add(a, b){
    return {x: a.x+b.x, y: a.y+b.y, z: a.z+b.z};
}
function sub(a, b){
    return {x: a.x-b.x, y: a.y-b.y, z: a.z-b.z};
}
function normalize(vec3){
    var len = Math.sqrt(vec3.x*vec3.x+vec3.y*vec3.y+vec3.z*vec3.z);
    return mul(vec3, 1/len);
}


function movePupils(){
    //console.log("called move pupils");
    var mousePos = {x: pageX, y: pageY, z: w}
    for (let i = 0; i < pupilList.length; i++){
        var eye = eyeList[i];
        var eyeScreenPos = getOffset(eye); // the pupils position on the screen plane
        var eyePos = {x: eyeScreenPos.x, y: eyeScreenPos.y, z: w};
        //console.log(pos.x+" "+pos.y+" "+pos.z+" "+(eye.style.zIndex));
        eyePos = mul(eyePos, -eye.style.zIndex / w); // the object position without "perspective" applied
        
        var dir = normalize(sub(mousePos, eyePos));
        //console.log(dir.x+" "+dir.y);
        var pupil = pupilList[i];
        
        var pupilPos = add(eyePos, mul(dir, eyeRadius));
        //console.log(pupilPos.x+" "+pupilPos.y);
        var pupilScreenPos = mul(pupilPos, w / pupilPos.z);

        pupil.style.left = (pupilScreenPos.x-eyeScreenPos.x)+"px";
        pupil.style.top = (pupilScreenPos.y-eyeScreenPos.y)+"px";

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
}

for (let i = 0; i < 9; i++)
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
