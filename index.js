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



var eyeCon = document.getElementById("eye-generator");

var eyeList = [];
var pupilList = [];
var eyelidTopList = [];
var eyelidBotList = [];

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
    

    var rat = Math.random();
    eye.style.scale = (1-rat)*.75+.5;
    eye.style.setProperty('--parallax-speed', rat * 2000+"px");
    //console.log(eye.style.getPropertyValue('--parallax-speed'));
    
    eye.style.top = (Math.random()-.5)*2000+"px";
    eye.style.left = Math.random()*100+"%";

    eye.style.zIndex = -Math.round(rat*3)-3;

    eyeCon.appendChild(eye);
    eyeList.push(eye);
    pupilList.push(pupil);
    eyelidTopList.push(eyeLidTop);
    eyelidBotList.push(eyeLidBot);
}


for (let i = 0; i < 17; i++)
    generateEye();

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
}


var pageX = window.innerWidth/2;
var pageY = window.innerHeight/2;
var lastScrollPos = 0;

function update(){
    pageY += window.scrollY - lastScrollPos;
    lastScrollPos = window.scrollY;
    movePupils();
    setEyeVis();
}

function setEyeVis(){
    for (let i = 0; i < eyeList.length; i++){
        var eye = eyeList[i];
        var x = pageX-getOffset(eye).left;
        var y = pageY-getOffset(eye).top;
        var len = Math.sqrt(x*x+y*y);

        var yPercent = y / window.innerHeight;
        eye.style.opacity = 1-Math.abs(yPercent*2);

        var eyeLidOffset = "0 "+(-250+Math.min(Math.abs(yPercent)*750,250)+"px");

        var eyeLidTop = eyelidTopList[i];
        var eyeLidBot = eyelidBotList[i];
        eyeLidTop.style.setProperty("object-position",eyeLidOffset);
        eyeLidBot.style.setProperty("object-position",eyeLidOffset);
    }
}

function movePupils(){
    console.log("called move pupils");
    for (let i = 0; i < pupilList.length; i++){
        var pupil = pupilList[i];
        var x = pageX-getOffset(pupil).left;
        var y = pageY-getOffset(pupil).top;
        var len = Math.sqrt(x*x+y*y);
        x /= len;
        y /= len;

        var max = 50;
        var percent = Math.min(1,len/max);

        x *= 25 * percent;
        y *= 25 * percent;

        pupil.style.left = x+"%";
        pupil.style.top = y+"%";
        //console.log(x+" "+y);
    }
}

addEventListener("mousemove", (event)=>{
    pageX = event.pageX;
    pageY = event.pageY;
});

addEventListener("mousemove", update);
addEventListener("scroll", update);