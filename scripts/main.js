const gui = new dat.GUI()

let img, mask
preload = () => {
	img = loadImage("./njs-levels.png")
}

setup = () => {
	createCanvas(windowWidth, windowHeight)
	mask = createGraphics(img.width, img.height)
	stroke(0)
	angleMode(DEGREES)
	pixelDensity(1)
}

const c = function() {
	this.noiseStrength = 0.15
	this.vertexCount = 60
	this.yOffsetIncrement = 0.01
	this.size = {
		value: 280,
		baseValue: 280,
		variation: 100
	}
	this.stroke = {
		size: 15,
		baseSize: 15,
		variation: 8
	}
}

let yOffset = 0
let ctrl = new c()
gui.add(ctrl, "noiseStrength", 0.05, 0.9)
gui.add(ctrl, "vertexCount", 5, 180, 1)
gui.add(ctrl, "yOffsetIncrement", 0.01, 0.2)
// gui.add(ctrl.size, "variation", 50, 200, 1).name("Size variation")
// gui.add(ctrl.stroke, "variation", 2, 20, 1).name("Stroke variation")

draw = () => {
	console.log(frameRate());
	let distanceToCenter = {
		x : ((width / 2 - abs(width / 2 - mouseX)) / width * 2),
		y  :(height / 2 - abs(height / 2 - mouseY)) / height * 2
	}
	ctrl.noiseStrength = distanceToCenter.x * distanceToCenter.y
	ctrl.noiseStrength = constrain(ctrl.noiseStrength, 0.08, 0.7)
	mask.clear()
	clear()
	mask.push()
	mask.translate(mask.width / 2, mask.height / 2)	
	mask.fill(0)
	yOffset += ctrl.yOffsetIncrement
	ctrl.stroke.size += map(noise(yOffset), 0, 1, -1, 1)
	ctrl.stroke.size = constrain(
		ctrl.stroke.size,
		ctrl.stroke.baseSize - ctrl.stroke.variation,
		ctrl.stroke.baseSize + ctrl.stroke.variation
	)
	ctrl.size.value += map(noise(0, 0, yOffset), 0, 1, -1, 1)
	ctrl.size.value = constrain(
		ctrl.size.value,
		ctrl.size.baseValue - ctrl.size.variation,
		ctrl.size.baseValue + ctrl.size.variation
	)
	mask.beginShape()
	for (
		let j = ctrl.size.value - ctrl.stroke.size;
		j < ctrl.size.value + ctrl.stroke.size;
		j++
	) {
		for (let i = 0; i < ctrl.vertexCount; i++) {
			let angle = map(i, 0, ctrl.vertexCount, 0, 360)
			let xValue =
				cos(angle) *
				j *
				map(
					noise(angle, yOffset),
					0,
					1,
					1 - ctrl.noiseStrength,
					1 + ctrl.noiseStrength
				)
			let yValue =
				sin(angle) *
				j *
				map(
					noise(angle, yOffset),
					0,
					1,
					1 - ctrl.noiseStrength,
					1 + ctrl.noiseStrength
				)
			mask.curveVertex(xValue, yValue)
		}
	}
	mask.endShape()
	mask.pop()
	let imgCopy = img.get()
	translate(windowWidth / 2 - img.width / 2, windowHeight / 2 - img.height /2)
	imgCopy.mask(mask)
	image(imgCopy, 0,0)
}
