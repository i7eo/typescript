// // 寄生组合式继承
// function extend(Child, Parent) {
// 　　　　var F = function(){};

// 　　　　F.prototype = Parent.prototype;

// 　　　　Child.prototype = new F();

// 　　　　Child.prototype.constructor = Child;

// 　　　　Child.uber = Parent.prototype;

// 　　}

// function Ball() {
// 	this.name = name
// 	this.play = () => {
// 		console.log(this.name)
// 	}
// }

// function BasketBall(name: string) {
// 	Ball.apply(this, arguments)
// 	this.name = name
// 	this.play = () => {
// 		console.log(this.name)
// 	}
// }

// // BasketBall.prototype = new Ball()
// // BasketBall.prototype.constructor = BasketBall
// extend(BasketBall, Ball)


class Ball {
	constructor(public name: string) {}

	play() {}
}

class BasketBall extends Ball {
	constructor(public name: string) {
		super(name)
	}
}