const gui = new dat.GUI()

setup = () => {
	createCanvas(windowWidth, windowHeight)
	stroke(0)
	angleMode(DEGREES)
	// frameRate(2)
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
	clear()
	translate(windowWidth / 2, windowHeight / 2)
	yOffset += ctrl.yOffsetIncrement
	noFill()
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
	beginShape()
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
			curveVertex(xValue, yValue)
		}
	}
	endShape()
}
