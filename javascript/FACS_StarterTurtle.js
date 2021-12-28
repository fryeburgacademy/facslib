function FACSTurtle(width = 300, height = 180, speed = 100, gridSize = 30,debug = false){
    
    this.debugMode = debug;     // debug flag triggers verbose output to console during execution
    this.width = width;         // the width of the canvas
    this.height = height;       // the height of the canvas
    this.speed = speed;         // the "speed" of the turtle; lower is faster; it's the pause between steps
    this.controlHeight = 20;    // height of the control bar in the window
    this.gridSize = gridSize;   // size of grid lines on canvas
    this.grid;                  // a second canvas for drawing the grid
    this.pen;                   // the pen
    this.turtle;                // the turtle itself
    this.backgroundCanvas;      // the background color canvas
    this.penCanvas;             // the canvas the pen actually draws on
    this.turtleCanvas;          // the canvas the turtle appears on
    this.tFrame;
    this.looper;
    this.stepCount = 0;
    this.steps = [];            // array of "steps" the turtle will take during execution
    this.angle = -90;           // start the turtle facing North
    this.color = "#000000";     // start the color as black
    this.fontSize = 14;         // default font size of 14
    this.penWidth = 1;          // default pen width of 1
    this.drawing = true;        // flag for whether or not the turtle should be drawing
    this.turtleSize = 15;
    this.x = Math.floor(this.width / 2);    // starting x location for turtle (horizontal middle)
    this.y = Math.floor(this.height / 2);   // starting y location for turtle (vertical middle)
    
    _this = this;               // self reference for nested functions
    
    this.start = function(){
        
        _this.setupCanvas();
        if(_this.gridSize > 0){
            _this.drawGrid();
        }
        
        if(this.shouldAnimate()){
            console.log("Animating...");
            clearInterval(_this.looper);
            _this.looper = setInterval(_this.animateLoop, _this.speed);
        }
    }

//     this.whisper = function(text){
//         _this.addStep(function(){
//             console.log("Turtle says: " + text);
//         });
//     }
    
//     this.setBackgroundColor = function(color){
//         _this.addStep(function(){
//             _this.backgroundCanvas.style.backgroundColor = color;
//         });
//     }
    
//     this.write = function (text){
//         _this.addStep(function(){
//         	_this.pen.fillStyle = _this.color;
//             _this.pen.fillText(text,_this.x,_this.y);
//         });
//     }
    
//     this.setFontSize = function(size){
//         _this.addStep(function(){
//             _this.fontSize = size;
//             _this.pen.font = size + "px Arial";
//         });
//     }
    
//     // set a specific degree - 0 is UP, 90 is RIGHT, 180 is DOWN, 270 is LEFT
//     this.turnTo = function (deg){
//         _this.addStep(function(){
//             _this.angle = -deg;
//         });
//     }
    
//     this.turnLeft = function(deg = 90){
//         _this.turnRight(-deg);
//     }
    
    this.turnRight = function(deg = 90){
        _this.addStep(function(){
            _this.angle += deg;
        });
    }
    
    this.penUp = function(){
        _this.addStep(function(){
           _this.drawing = false; 
        });
    }
    
    this.penDown = function(){
        _this.addStep(function(){
           _this.drawing = true; 
        });
    }
    
//     this.moveBackward = function(length){
//         _this.moveForward(-length);
//     }
    
//     this.moveTo = function(x,y){
//         _this.addStep(function(){
//             _this.newPath();
//             if(_this.drawing){
//                 _this.pen.lineTo(x, y);
//             }else{
//                 _this.pen.moveTo(x, y);
//             }
            
//             _this.turtle.moveTo(x,y);
//             _this.x = x;
//             _this.y = y;
            
//         });
//     }
    
    this.newPath = function (){
        _this.pen.stroke();
        _this.pen.beginPath();
        _this.pen.moveTo(_this.x,_this.y);
        _this.pen.lineWidth = _this.penWidth;
        _this.pen.strokeStyle = _this.color;
    }
    
//     _this.arcLeft = function(arcAngle,r){
//         _this.makeArc(arcAngle,r,true);
//     }
    
//     _this.arcRight = function(arcAngle,r){
//         _this.makeArc(arcAngle,r,false);
//     }
    
//     _this.makeArc = function(arcAngle,r,left){
//         _this.addStep(function(){
//             _this.newPath();
//             var startAngle = 0;
//             var endAngle = 0;
            
//             if(left){ // left arc
//                 startAngle = (_this.angle+90) * (Math.PI/180);
//                 endAngle = (_this.angle+90 - arcAngle) * (Math.PI/180);
//             } else { // right arc
//                 startAngle = (_this.angle-90) * (Math.PI/180);
//                 endAngle = (_this.angle-90 + arcAngle) * (Math.PI/180);
//             }
    
//             // find center point
//             var angleToCenter = left?_this.angle-90:_this.angle+90;
//             var x = _this.x + r * Math.cos(Math.PI * angleToCenter / 180.0),
//                 y = _this.y + r * Math.sin(Math.PI * angleToCenter / 180.0);
//             //TODO: respect the pen rules!
//             _this.pen.arc(x,y,r,startAngle,endAngle,left);
//             _this.x = x+Math.cos(endAngle)*r;
//             _this.y = y+Math.sin(endAngle)*r;
//             _this.angle += left?-arcAngle:arcAngle;
//             _this.turtle.moveTo(_this.x,_this.y);
//             _this.turtle.stroke();
//         });     
//     }
    
    
    this.moveForward = function(length = this.gridSize){
        _this.addStep(function(){
            
            _this.newPath();
            
            var x2 = _this.x + length * Math.cos(Math.PI * _this.angle / 180.0);
            
            var y2 = _this.y + length * Math.sin(Math.PI * _this.angle / 180.0);
            
            _this.log(x2 + ":" + y2);
            
            if(_this.drawing){
                _this.pen.lineTo(x2, y2);
                _this.log("pen is down");
            }else{
                _this.pen.moveTo(x2, y2);
                _this.log("pen is up");
            }
    
            _this.x = x2;
            _this.y = y2;
            _this.turtle.moveTo(_this.x,_this.y); // move the visual turtle too
            
            _this.log("Move Forward: " + length + "(" + _this.x + "," + _this.y +")");
            _this.pen.stroke();
            
        });
    }
    
    
    this.setWidth = function(w){
        _this.addStep(function(){
            _this.penWidth = w;
        });
    }
    
    this.setColor = function(c){
        _this.addStep(function(){
            _this.color = c;
        });
    }
    
    
    this.drawGrid = function (){
        _this.addStep(function(){
            
            console.log("Drawing grid...");
            _this.grid.beginPath();
            _this.grid.lineWidth = 1;
            _this.grid.strokeStyle = "#eeeeff";
            
            for(var row = 0; row <= Math.max(_this.width,_this.height); row += _this.gridSize){
                _this.grid.moveTo(0,row);
                _this.grid.lineTo(_this.width,row);
                _this.grid.moveTo(row,0);
                _this.grid.lineTo(row,_this.height);
            }
            
            _this.grid.font = "10px Arial";
            _this.grid.fillText("0,0", 3,10);
            _this.grid.fillText(_this.width + "," + _this.height, _this.width-40,_this.height-5);
            _this.grid.stroke();
            
            
        });
    }
    
    
    // add the next step to the queue
    this.addStep = function(step){
        
        if(_this.shouldAnimate()){
            _this.steps.push(step);
        } else {
            step();
            _this.pen.stroke();
            _this.refreshTurtle();
        }
    }
    
    this.shouldAnimate = function(){
        var anim = _this.speed > 0
        return anim;
    }
    
    this.animateLoop = function(){
        if(_this.steps.length == _this.stepCount){
            clearInterval(_this.looper);
            console.log("Done with steps.");
        }else{
            _this.nextStep();
        }    
    }
    
    this.nextStep = function(){
        if(_this.stepCount < _this.steps.length){
            _this.log("Step: " + _this.stepCount);
            _this.steps[_this.stepCount]();
            _this.stepCount++;
            _this.refreshTurtle();
            _this.pen.stroke();
        }
        
        
    }
    
    
    this.log = function (message){
        if(_this.debugMode){
            console.log(message);
        }
    }
    
    
    this.setupCanvas = function(){
        _this.log("Running setup...");
        // create the wrapping div with shadow
        _this.tFrame = document.createElement('div');
        var tStyle = _this.tFrame.style;
        tStyle.border = "2px solid black";
        tStyle.boxShadow = "3px 3px 5px #aaaaaa";
        tStyle.display = "block";
        tStyle.position = "relative";
        tStyle.margin = "10px auto";
        tStyle.width = _this.width + "px";
        tStyle.height = _this.height + _this.controlHeight + "px";
        tStyle.fontSize = "10px";
        tStyle.fontFamily = "Arial, Helvetica, sans-serif";
        tStyle.zIndex = "0";
        
        // create the "grid" canvas
        _this.backgroundCanvas = document.createElement('canvas');
        _this.backgroundCanvas.width = _this.width;
        _this.backgroundCanvas.height = _this.height;
        var bStyle = _this.backgroundCanvas.style;
        bStyle.width = _this.width + "px";
        bStyle.height = _this.height + "px";
        bStyle.backgroundColor = "white";
        bStyle.display = "block";
        bStyle.position = "absolute";
        bStyle.top = _this.controlHeight + "px";
        bStyle.left = "0px";
        bStyle.zIndex = "1";
        
        // create the paper surface
        _this.penCanvas = document.createElement('canvas');
        _this.penCanvas.width = _this.width;
        _this.penCanvas.height = _this.height;
        
        var penStyle = _this.penCanvas.style;
        penStyle.width = _this.width + "px";
        penStyle.height = _this.height + "px";
        penStyle.display = "block";
        penStyle.position = "absolute";
        penStyle.top = _this.controlHeight + "px";
        penStyle.left = "0px";
        penStyle.zIndex = "2";
        
        // create the turtle overlay surface
        _this.turtleCanvas = document.createElement('canvas');
        _this.turtleCanvas.width = _this.width;
        _this.turtleCanvas.height = _this.height;
        var turtleStyle = _this.turtleCanvas.style;
        turtleStyle.width = _this.width + "px";
        turtleStyle.height = _this.height + "px";
        turtleStyle.display = "block";
        turtleStyle.position = "absolute";
        turtleStyle.top = _this.controlHeight + "px";
        turtleStyle.left = "0px";
        turtleStyle.zIndex = "3";
        
        // get the 2D context for each
        _this.grid = _this.backgroundCanvas.getContext("2d");
        _this.pen = _this.penCanvas.getContext("2d");
        _this.turtle = _this.turtleCanvas.getContext("2d");
        
        // center the turtle to start
        _this.log("Centering turtle...");
        _this.turtle.moveTo(_this.x,_this.y);
        
        // add control toolbar
        var label = document.createElement('div');
        label.style.position = "absolute";
        label.style.top = "0px";
        label.style.left = "0px";
        label.style.backgroundColor = "#336699";
        label.style.color = "white";
        label.style.height = _this.controlHeight + "px";
        label.style.width = _this.width + "px";
        label.style.zIndex = "10";
        
        label.innerHTML = _this.width + "W x " 
                            + _this.height + "H&nbsp;&nbsp;&nbsp;Animation Delay: " 
                            + _this.speed + "ms";
        
        // add to page
        document.body.appendChild(_this.tFrame);
        _this.tFrame.appendChild(label);
        _this.tFrame.appendChild(_this.backgroundCanvas);
        _this.tFrame.appendChild(_this.penCanvas);
        _this.tFrame.appendChild(_this.turtleCanvas);


        // report x:y if user clicks canvas
        var that = this;

        _this.turtleCanvas.addEventListener("click",function (event) {
            // "this" refers to the canvas because it's an event listener
            var rect = that.turtleCanvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            console.log("x: " + x + " y: " + y);
            
        });
        
    }
    
    this.clear = function(){
        _this.addStep(function(){
            _this.pen.clearRect(0,0,_this.width,_this.height); 
            _this.pen.beginPath(); // Gon E fix!!
        });
    }
    
    _this.refreshTurtle = function (){
        
        var size = _this.turtleSize;
        var vector = 20;
        
        _this.turtle.clearRect(0,0,_this.width,_this.height);
        // draw the turtle itself
        _this.turtle.beginPath();
        _this.turtle.strokeStyle = "#555555";
        
        var grd=_this.turtle.createLinearGradient(_this.x,_this.y,_this.x+_this.turtleSize/2,_this.y+_this.turtleSize/2);
        grd.addColorStop(0,_this.color);
        grd.addColorStop(1,"#cccccc");
        
        _this.turtle.fillStyle = grd;
        
        var xL = _this.x - size * Math.cos(Math.PI * (_this.angle-vector) / 180.0),
            yL = _this.y - size * Math.sin(Math.PI * (_this.angle-vector) / 180.0),
            xR = _this.x - size * Math.cos(Math.PI * (_this.angle+vector) / 180.0),
            yR = _this.y - size * Math.sin(Math.PI * (_this.angle+vector) / 180.0),
            xM = _this.x - (size*.7) * Math.cos(Math.PI * (_this.angle) / 180.0),
            yM = _this.y - (size*.7) * Math.sin(Math.PI * (_this.angle) / 180.0);
        
        _this.turtle.moveTo(xL, yL);
        _this.turtle.lineTo(_this.x, _this.y)
        _this.turtle.lineTo(xR, yR);
        _this.turtle.lineTo(xM,yM);
        _this.turtle.fill();
        _this.turtle.closePath();
        _this.turtle.stroke();
        
    }
    
    // start the turtle
    this.start();

    
}
