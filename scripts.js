
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