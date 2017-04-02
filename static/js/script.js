var gameBoard;
var solutionBoard;
alert("For Mobile Use Only Switch To Mobile Please")
init();

function init(){
	gameBoard  = new Board();
	solutionBoard = new Board();

	//create solution
	newPuzzle(solutionBoard);

	//generate html for solution and
	initHTML();

	//copy, then scramble gameBoard
	solutionBoard.copy(gameBoard);
	var randomVal;
	var moves = [ // alex tried to help; he failed
		function(){gameBoard.rowShiftLeft(randomVal);},
		function(){gameBoard.rowShiftRight(randomVal);},
		function(){gameBoard.colShiftUp(randomVal);},
		function(){gameBoard.colShiftDown(randomVal);}
	];

	//scramble by doing one move every .1 second for 3 seconds
	var refreshIntervalId = setInterval(function(){
		var randomFunction = Math.floor(Math.random()*4);
		randomVal = Math.floor(Math.random()*5);
		moves[randomFunction]();
	}, 100);
	setTimeout(function(){ clearInterval(refreshIntervalId);}, 3000);
}

function initHTML(){
	var grid = document.getElementById("grid");

	for(var i = 0; i < 25; ++i){
		var temp = document.createElement("div");
		temp.className = "cell"+" row"+ (i-(i%5))/5 + " col"+(i%5)
		temp.id = i;
		temp.style.backgroundColor = shittyColor(gameBoard.get(i%5, (i-(i%5))/5));
		grid.appendChild(temp);
		(i+1)%5 == 0 ? grid.appendChild(document.createElement("br")) : {} ;
	}

	var solutionGrid = document.getElementById("solution")
	for(var i = 0; i < 25; ++i){
		var temp = document.createElement("div");
		temp.className = "cell";
		temp.style.backgroundColor = shittyColor(solutionBoard.get(i%5, (i-(i%5))/5));
		solutionGrid.appendChild(temp);
		temp.style.width = "8px";
		temp.style.height = "8px";
		(i+1)%5 == 0 ? solutionGrid.appendChild(document.createElement("br")) : {} ;
	}
}

function updateCurrent(){
	for(var i = 0; i < 25; ++i){
		var theCell = document.getElementById(i);
		theCell.style.backgroundColor = shittyColor(gameBoard.get(i%5, (i-(i%5))/5));
	}
}

function Board (){
	this.values = [];

	this.get = function(x,y){
		return this.values[(y*5)+x];
	};
	this.set = function(x,y,val){
		this.values[(y*5)+x] = val;
	};

	this.copy = function(other){
		other.values = this.values.slice();
	};

	this.returnAll = function(){
		return this.values;
	}

	this.checkSolution = function(otherBoard){
		return (this.returnAll().equals(otherBoard.returnAll()));
	}

	this.rowShiftLeft = function(row){
		var temp = this.get(0,row);
		for(var i = 0; i < 4; ++i){
			var tempVal = this.get(1+i,row);
			this.set(i,row,tempVal);
		}
		this.set(4,row,temp); //duh, cant you combine this with the first line? freaking retard
		$('.row'+row).each(function(i){
			var aThis = this
			$(this).addClass('rowLeft')
			setTimeout(function(){ $(aThis).removeClass('rowLeft'); updateCurrent();}, 100);
		})
	};

	this.rowShiftRight = function(row){
		var temp = this.get(4,row);
		for(var i = 0; i < 4; ++i){
			var tempVal = this.get(3-i, row);
			this.set(4-i,row,tempVal);
		}
		this.set(0,row,temp);
		$('.row'+row).each(function(i){
			var aThis = this
			$(this).addClass('rowRight')
			setTimeout(function(){ $(aThis).removeClass('rowRight'); updateCurrent();}, 100);
		})
	};

	this.colShiftUp = function(col){
		var temp = this.get(col,0);
		for(var i = 0; i < 4; ++i){
			var tempVal = this.get(col,1+i);
			this.set(col,i,tempVal);
		}
		this.set(col,4,temp); //duh, cant you combine this with the first line? freaking retard
		$('.col'+col).each(function(i){
			var aThis = this
			$(this).addClass('colUp')
			setTimeout(function(){ $(aThis).removeClass('colUp'); updateCurrent();}, 100);
		})
	};

	this.colShiftDown = function(col){
		var temp = this.get(col,4);
		for(var i = 0; i < 4; ++i){
			var tempVal = this.get(col,3-i);
			this.set(col,4-i,tempVal);
		}
		this.set(col,0,temp);
		$('.col'+col).each(function(i){
			var aThis = this
			$(this).addClass('colDown')
			setTimeout(function(){ $(aThis).removeClass('colDown'); updateCurrent();}, 100);
		})
	};
}

function shittyColor(val){
	var r = 247 + (val*30);
	var g = 158 + (val*30);
	var b = 153 + (val*30);

	return "rgb(" + r + "," + g + "," + b  + ")";
}

var theGrid = document.getElementById('grid'),
	startx, // starting x coordinate of touch point
	starty,
	touchobj = null, // Touch object holder
	element,
	num;

	document.body.addEventListener('touchstart', function(e){
			touchobj = e.changedTouches[0] // reference first touch point
			startx = parseInt(touchobj.clientX) // get x coord of touch point
			starty = parseInt(touchobj.clientY)
			element = document.elementFromPoint(touchobj.clientX,touchobj.clientY)
			num = parseInt(element.id)
	}, false)

	document.body.addEventListener('touchend', function(e){
			var touchobj = e.changedTouches[0] // reference first touch point for this event
			var distx = parseInt(touchobj.clientX) - startx
			var disty = parseInt(touchobj.clientY) - starty
			var compx = Math.abs(distx)
			var compy = Math.abs(disty)
			var num = parseInt(element.id)

			var col = num%5
			var row = (num - (num%5) )/5
			if(compx > compy)
			{
				if(distx<0)
					gameBoard.rowShiftLeft(row)
				else if(distx>0)
					gameBoard.rowShiftRight(row)
			}
			else
			{
				if(disty<0)
					gameBoard.colShiftUp(col)
				else if (disty>0)
					gameBoard.colShiftDown(col)
			}

			if(gameBoard.checkSolution(solutionBoard)){
				document.getElementById("overlay").style.display = "block";
				console.log("complete");
			}


	}, false)

	Array.prototype.equals = function( array ) {
	return this.length == array.length &&
		this.every( function(this_i,i) { return this_i == array[i]; } )
	}

function newPuzzle(board){
	var type = Math.floor(Math.random()*3);
	console.log(type);
	switch (type) {
		case 0:
			for(var y = 0; y < 5; ++y)
				for(var x = 0; x < 5; ++x)
					board.set(x,y,Math.floor((Math.random()*2)));
			break;
		case 1:
			var pattern = [Math.floor(Math.random()*2),Math.floor(Math.random()*2),Math.floor(Math.random()*2),Math.floor(Math.random()*2)];
			console.log(pattern);
			if((pattern[0] === pattern[1]) === (pattern[2] === pattern[3])){
				newPuzzle(board);
				return;
			}
			for(var i = 0; i < 25; ++i)
				board.set(i%5, (i-(i%5))/5, pattern[i%4]);
			break;
		case 2:
			for(var i = 0; i < 15; ++i)
				board.set(i%5, (i-(i%5))/5, Math.floor(Math.random()*2));
			console.log(board);
			for(var i = 24; i >= 15 ; --i)
				board.set(i%5, (i-(i%5))/5, board.get((i%5), ((i-(i%5))/5) == 4 ? 0:1));
			break;
	}
}

function onAfterClick(){
	console.log("yep");
	history.go(0);
}