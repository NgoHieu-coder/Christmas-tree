
function snow(){
    /*1. Identify The Snowflake Pattern*/
    var flake = document.createElement("div");
    //Snow character ❄❉❅❆✻✼❇❈❊✥✺
    flake.innerHTML = "❄";
    flake.style.cssText = "position:absolute; color:#fff;";
    //Get the height of the page, which is equivalent to the Y-axis position when the snowflake ends falling
    var documentHeight = window.innerHeight;
    //Get the width of the page, and use this number to calculate the value of left when the snowflake starts falling
    var documentWidth = window.innerWidth;
    //Define the number of milliseconds to generate a snowflake
    var millisec = 100;

    /* 2. Set the first timer, a periodic timer, to generate a snowflake every millisec*/
    setInterval(function(){
        //After the page is loaded, the timer starts working 
        //Randomly generated the left value at the beginning of the snowflake drop, which is equivalent to the position of the X axis at the beginning of the snowflake drop
        var startsLeft = Math.random() * documentWidth;
        //Randomly generated the left value at the end of the snowflake drop, which is equivalent to the position of the X axis at the end
        var endLeft = Math.random() * documentWidth;
        //Randomly generate the transparency of the snowflake drop at the beginning
        var startOpacity = 0.7 + 0.3 * Math.random();
        //Randomly generate the transpareny of the snowflake drop at the end
        var endOpacity = 0.2 + 0.2 * Math.random();
        //Clone a snowflake template 
        var cloneFlake = flake.cloneNode(true);
        //Modify the style for the first time, define the style of the cloned snowflake
        cloneFlake.style.cssText += `left: ${startLeft}px;
                                    opacity: ${startOpacity};
                                    font-size: ${flakeSize}px;
                                    top: -25px;
                                    transition: ${durationTime}ms;
                                    `;
        //Splice to the page
        document.body.appendChild(cloneFlake);
        //Set the second timer, a once-time timer
        //When the first timer generates snowflakes and renders them on the page, modify the style of the snowflakes to make them move 
        setTimeout(function(){
            //Modify the style for the second time
        cloneFlake.style.cssText += `left: ${endLeft}px;
                                    top: ${documentHeight}px;
                                    opacity: ${endOpacity};     
                                     `;
        //4. Set the third timer, and delete the snowflakes when they fall
        setTimeout(function(){
            cloneFlake.remove();
        }, durationTime);
        }, 0);
    }, millisec)
}

snow ();
MorphSVGPlugin.convertToPath("polygon");
var xmlns = "http://www.w3.org/2000/svg",
    xlinkns = "http://www.w3.org/1999/xlink",
    select = function(s){
        return document.querySelector(s);
    }, 
    selectAll = function(s){
        return document.querySelectorAll(s);
    },
    pContainer = select(".pContainer"),
    mainSVG = select(".mainsvg"),
    star = select("#star"),
    sparkle = select (".sparkle"),
    tree = select("#tree"),
    showParticle = true ,
    particleColorArray = [
        "#E8F6F8",
        "#ACE8F8",
        "#F6FBFE",
        "#A2CBDC",
        "#B74551",
        "#5DBA72",
        "#910B28",
        "#910B28",
        "#446D39",
    ],
    particleTypeArray = ["#star", "#circ", "#cross", "#heart"],
    // particleTypeArray = ['#star'],
    particlePool = [],
    particleCount = 0,
    numParticles = 201;
    
    // gsap animation library
    gsap.set(sparkle, {
        transformOrigin: "50% 50%",
        y: -100,
    });

let getSVGPoints = (path) =>{
    let arr = [];
    var rawPath = MotionPathPlugin.getRawPath(path)[0];
    rawPath.forEach((el, value) =>{
        let obj = {};
        obj.x = rawPath[value * 2];
        obj.y = rawPath[value * 2 + 1];
        if (value % 2){
            arr.push(obj);
        }
        // console.log(value);
    });
    return arr;
};
let treePath = getSVGPoints(".treePath");

var treeBottomPath = getSVGPoints("treeBottomPath");

//console.log(starPath.length);
var mainl = gsap.timeline({delay: 0, repeat: 0}),
starTl;

//tl.seek(100).timeScale(1.82);

function flicker(p){
    //console.log("flivker")
    gsap.killTweensOf(p, {opacity: true });
    gsap.fromTo(
        p,
        {
            opacity: 1,
        },
        {
            duration: 0.07,
            opacity: Math.random(),
            repeat: -1,
        }
    );
}

function createParticles(){
    //var step = numParticles/starPath.length;
    //console.log(starPath.length)
    var i = numParticles,
     p,
     particleTl,
     step = numParticles / treePath.length,
     pos;
    while (--i > -1){
        p = select(particleTypeArray[i % particleTypeArray.length.length]).cloneNode(
            true
        );
        mainSVG.appendChild(p);
        p.setAttribute("class", "particle");
        particlePool.push(p);
        //hide them initially
        gsap.set(p,{
            x: -100,
            y: -100,
            transformOrigin:" 50% 50%",
        });
    }
}

var getScale = gsap.utils.random(0.5, 3, 0.001, true); //The special effect of the small light spot animation when the Christmas tree starts to draw (parameters: minimum, maximum, delay)

function playParticel(p){
    if (!showParticle){
        return;
    }
    var p = pariclePool[particleCount];
    gsap.set(p,{
        x: gsap.getProperty(".pContainer", "x"),
        y: gsap.getProperty(".pContainer", "y"),
        scale: getScale(),
    });
    var tl = gsap.timeline();
    tl.to(p, {
        duration: gsap.utils.random(0.61, 6),
        physics2D: {
            velocity: gsap.utils.random(-23, 23),
            angle:gsap.utils.random(-180, 180),
            gravity: gsap.utils.random(-6, 50),
        },
        scale: 0,
        rotation: gsap.utils.random(-123, 360),
        ease: "power1",
        onStart: flicker,
        onStartParams: [p],
        //repeat: -1,
        onRepeat: (p) => {
            gsap.set(p, {
                scale: getScale(),
            });
        },
        onReapeatParams: [p],
    });

    //particlePool[partcleCount].play();
    particleCount++;
    //mainTl.add(tl, i / 1.3)
    particleCount = particleCount >= numParticle ? 0 : particleCount;
}

// The small light spot animation when the Christmas tree starts drawing
function drawStar(){
    starTl = gsap.timeline({onUpdate: playParticle});
    starTl
        .to(".pContainer, .sparkle", {
            duration: 6,
            motionPath:{
                path: ".treePath",
                autoRotate: false,
            },
            ease: "linear",
        })
        .to(".pContainer, .sparkle", {
            duration: 1,
            onStart: function(){
                showParticle = false;
            },
            x: treeBottomPath[0].x,
            y: treeBottomPath[0].y,
        })
        .to(
            ".pContainer, .sparkle",{
                duration: 2,
                onStart: function(){
                    showParticle = true;
                },
                motionPath:{
                    path: ".treeBottomPath",
                    autoRotate: false,
                },
                ease: "linear",
            },
            "-=0"
        )
        //The horizontal line animation in the middle of the Christmas tree .treeBottomMask is bound to the tag class='treeBottomMask'
        .from(
            ".treeBottomMask", 
            {
                duration: 2,
                drawSVG: "0% 0%",
                stroke: "#FFF",
                ease: "linear",
            },
            "-=2"
        );
        // gsap.starggerTo(particlePool, 2, P{})
};

// ScrubGSAPTimeline(mainTl)

function drawMain(){
    mainTl
    // Christmas tree upper body silhouette animation
    .from([".treePathMask", "treePotMask"],{
        duration: 6,
        drawSVG: "0% 0%",
        stroke: "#FFF",
        stagger:{
            each: 6,
        },
        duration: gsap.utils.wrap([6, 1, 2]),
        ease: "linear",
    })
    // Christmas tree star animation
    .from(".treeStar",
        {
            duration: 3,
            //skewY: 270,
            scalesY: 0,
            scales: 0.15,
            transformOrigin: "50% 50%",
            ease: "elastic(1,0.5)",
        },
        "-=4"
    )
    // When the small light dots of the Christmas tree are drawn, make the small light dots disappear
    .to(
        "sparkle",
        {
            duration: 3,
            opacity: 0,

            ease: "rough({strength: 2, points: 100, template: linear, taper: both, randomize: true, clamp: false})",
        },
        "+=1"
    );
    /* .to('.whole', {opacity: 0}, '+=2') */
}

function drawStars(){
    let canvas = document.getElementById("stars"),
        ctx = canvas.getContext("2d"),
        w = (canvas.width = window.innerWidth),
        h = (canvas.height = window.innerHeight),
        hue = 37, //Hue Color
        stars = [], //Save all stars
        count = 0, //For counting stars
        maxStars = 1300; //Number of stars

    //canvas2 is used to create the source image of the star, i.e. the master,
    //Set according to the size of the star's own properties
    var canvas2 = document.createElement("canvas"),
        ctx2 = canvas2.getContext("2d");
    canvas2.width = 100;
    canvas2.height = 100;
    //Create a radial gradient, starting from a circle with a radius of 0 at coordinates (half, half),
    //end at a circle with a radius of half at coordinates (half, half)
    var half = canvas2.width / 2,
        gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, "#CCC");
    //hsl is another way to represent color.
    //h->hue, represents hue color, 0 is red, 120 is green, 240 is blue
    //s->saturation, represents saturation, 0%-100%
    //l->lightness, represents brightness, 0% is black, 100% is white
    gradient2.addColorStop(0.1, "hsl(" + hue + ", 61%, 10%)");
    gradient2.addColorStop(0.25, "hsl(" + hue + ", 64%, 2%)");
    gradient2.addColorStop(1, "transparent");
}