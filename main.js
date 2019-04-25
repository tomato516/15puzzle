// animation tool
const puzzle = document.querySelector(".puzzle");
const { forceGridAnimation } = animateCSSGrid.wrapGrid(puzzle);

const pieces = Array.from(document.querySelectorAll(".piece"));
const blankPiece = document.querySelector(".piece--blank");

// get congratulations heading
const heading = document.querySelector(".heading");

var countMoves = 0;
var randomPic;
var finalTime;

// key-value of pieces able to move
const areaKeys = {
	A: ["B", "E"],
	B: ["A", "C", "F"],
	C: ["B", "G", "D"],
	D: ["C", "H"],
	E: ["A", "F", "I"],
	F: ["B", "G", "E", "J"],
	G: ["C", "F", "K", "H"],
	H: ["D", "G", "L"],
	I: ["E", "J", "M"],
	J: ["I", "F", "N", "K"],
	K: ["G", "J", "O", "L"],
	L: ["H", "K", "P"],
	M: ["I", "N"],
	N: ["M", "J", "O"],
	O: ["N", "K", "P"],
	P: ["L", "O"]
};

// apply click listener to pieces
pieces.map(piece => {
	piece.addEventListener("click", () => {
		//increment/display count
		countMoves++;
		document.getElementById("moves").innerHTML = "Count: " + countMoves;

		//grab piece & blank piece, swap
		const pieceArea = piece.style.getPropertyValue("--area");
		const blankPieceArea = blankPiece.style.getPropertyValue("--area");
		blankPiece.style.setProperty("--area", pieceArea);
		piece.style.setProperty("--area", blankPieceArea);

		forceGridAnimation();

		unlockTiles(pieceArea);
	});
});

// lock & unlock pieces
const unlockTiles = currentTileArea => {
	// loop & check which pieces should be locked/unlocked
	pieces.map(piece => {
		const tileArea = piece.style.getPropertyValue("--area");
		if (areaKeys[currentTileArea.trim()].includes(tileArea.trim())) {
			piece.disabled = false;
			// piece.classList.remove("enabled");
		} else {
			piece.disabled = true;
			// console.log(piece);
			// piece.addEventListener("mouseover", function(event) {});
			// console.log(piece);
		}
	});

	//check after every move
	isComplete(pieces);
};

// check pieces are in position
const isComplete = pieces => {
	// get values of each piece
	const currentPiecesString = pieces
		.map(piece => piece.style.getPropertyValue("--area").trim())
		.toString();

	// check if the current puzzle is complete
	if (currentPiecesString == Object.keys(areaKeys).toString()) {
		finalTime = gameTimer.textContent;
		//display header & stop timer
		heading.innerHTML = `<h1 class="win">You Win!</h1><p>Number of Moves: ${countMoves}</p><p>Duration: ${finalTime}</p>`;
		clearTimeout(t);
	}
};

//calculate inversions
const inversionCount = array => {
	return array.reduce((acc, current, index, array) => {
		return array
			.slice(index)
			.filter(item => {
				return item < current;
			})
			.map(item => {
				return [current, item];
			})
			.concat(acc);
	}, []).length;
};

const shuffledKeys = keys => Object.keys(keys).sort(() => 0.5 - Math.random());

//shuffle puzzle after two seconds
setTimeout(shuffleBoard, 2000);

function shuffleBoard() {
	// solved puzzle
	let startingAreas = Object.keys(areaKeys);

	// use inversion function to check if the keys will be solveable & shuffle until solveable
	while (
		inversionCount(startingAreas) % 2 == 0 ||
		inversionCount(startingAreas) == 0
	) {
		startingAreas = shuffledKeys(areaKeys);
	}

	// apply solveable shuffled puzzle
	pieces.map((piece, index) => {
		piece.style.setProperty("--area", startingAreas[index]);
	});

	forceGridAnimation();
	unlockTiles(blankPiece.style.getPropertyValue("--area"));
}

//randomize & display puzzle images
function randomImage() {
	randomPic = Math.floor(Math.random() * 4);
	if (randomPic == 0) {
		toOtherImage("octocat");
	}
	if (randomPic == 1) {
		toOtherImage("reddit");
	}
	if (randomPic == 2) {
		toOtherImage("gsu");
	}
	if (randomPic == 3) {
		toOtherImage("stack");
	}
}

//Change puzzle background
function toOtherImage(pic) {
	const image = "img/" + pic + ".png";
	let x = document.querySelectorAll(".piece");

	x[0].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 0px 0px"
	);
	x[1].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 300px 0px"
	);
	x[2].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 200px 0px"
	);
	x[3].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 100px 0px"
	);
	x[4].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 0px 300px"
	);
	x[5].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 300px 300px"
	);
	x[6].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 200px 300px"
	);
	x[7].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 100px 300px"
	);
	x[8].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 0px 200px"
	);
	x[9].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 300px 200px"
	);
	x[10].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 200px 200px"
	);
	x[11].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 100px 200px"
	);
	x[12].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 0px 100px"
	);
	x[13].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 300px 100px"
	);
	x[14].setAttribute(
		"style",
		"background: url(" + image + "); background-position: 200px 100px"
	);
	x[15].setAttribute(
		"style",
		"background: transparent; background-position: 100px 100px"
	);

	//shuffle puzzle after two seconds loading image
	setTimeout(shuffleBoard, 2000);
}

//timer functions
var seconds = 0,
	minutes = 0;
var gameTimer = document.getElementById("gameTime");

function add() {
	seconds++;
	if (seconds >= 60) {
		seconds = 0;
		minutes++;
	}

	gameTimer.textContent =
		(minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
		":" +
		(seconds > 9 ? seconds : "0" + seconds);

	timer();
}

function timer() {
	t = setTimeout(add, 1000);
}
timer();
