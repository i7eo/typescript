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

	play() {
		super.play()

		// TODO:
	}
}

const aa = 123
const bb = <any>aa

class User {}

class UserA extends User {
	actionA() {
		console.log("actionA")
	}
}

class UserB extends User {
	constructor() {
		super()
	}

	action(user: UserA | UserB) {
		if(isUserA(user)) {
			user.actionA
		}
	}
}

function isUserA(user: UserA | UserB): user is UserA {
	return user instanceof UserA
}