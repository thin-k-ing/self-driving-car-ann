const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 5);

const n = 100;
const cars = generateCars(n);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
		if (i != 0) Network.mutate(cars[i].brain, 0.1);
	}
}

const traffic = [
	new Car(road.getLaneCenter(2), -200, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(1), -400, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(3), -400, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(4), -700, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(3), -1100, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -1200, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(3), -1400, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(1), -1500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(0), -1500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(1), -1700, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -1200, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(1), -4500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(3), -4400, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -5500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(4), -5700, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -2900, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(3), -3100, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(2), -3200, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(3), -3400, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(1), -3500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(0), -3500, 30, 50, "DUMMY", 2),
	new Car(road.getLaneCenter(1), -3700, 30, 50, "DUMMY", 2),
];

function generateCars(n) {
	const cars = [];

	for (let i = 1; i <= n; i++) {
		cars.push(new Car(road.getLaneCenter(2), 100, 30, 50, "AI"));
	}

	return cars;
}

animate();

function save() {
	localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
	localStorage.removeItem("bestBrain");
}

function animate(time) {
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].update(road.borders, []);
	}
	for (let i = 0; i < cars.length; i++) {
		cars[i].update(road.borders, traffic);
	}

	bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

	carCanvas.height = window.innerHeight;
	networkCanvas.height = window.innerHeight;

	carCtx.save();
	carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
	road.draw(carCtx);

	for (let i = 0; i < traffic.length; i++) {
		traffic[i].draw(carCtx, "red");
	}

	carCtx.globalAlpha = 0.2;
	for (let i = 0; i < cars.length; i++) {
		cars[i].draw(carCtx, "blue");
	}
	carCtx.globalAlpha = 1;
	bestCar.draw(carCtx, "blue", true);

	carCtx.restore();

	networkCtx.lineDashOffset = -time / 100;
	Visualizer.drawNetwork(networkCtx, bestCar.brain);

	requestAnimationFrame(animate);
}
