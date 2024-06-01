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


function ref<V>(value: V) {
	return {
		value
	}
}

const elRef = ref<HTMLElement | null>(null)
console.log(elRef.value)

class ArrayList<T> {
	constructor(public arr: T[]) {}

	add(ele: T) {
		this.arr.push(ele)
		return ele
	}

	get(idx: number) {
		return this.arr[idx]
	}
}

class ObjectRefImpl<T extends object, K extends keyof T> {
	public readonly __v_isRef = true
	
	constructor(private readonly _object: T, private readonly _key: K) {}
	
	get value() {
		return this._object[this._key]
	}
	
	set value(newValue) {
		this._object[this._key] = newValue
	}
}

const data = new ObjectRefImpl({ name: "i7eo", age: 29 }, "age")

enum MessageType {
	image = 'Image',
	audio = 'Audio'
}

interface Message {
	id: number
	type: MessageType
	description: string
}

type Keyof<T> = T extends any ? T : never

type aa = Keyof<keyof Message>

const messages: Message[] = [
	{
		id: 1,
		type: MessageType.image,
		description: 'message1'
	},
	{
		id: 2,
		type: MessageType.image,
		description: 'message2'
	},
	{
		id: 3,
		type: MessageType.audio,
		description: 'message3'
	}
]

function searchMessage(condition: number): Message | undefined
function searchMessage(condition: MessageType): Message[]
function searchMessage(condition: number | MessageType) {
	if(typeof condition === 'number') {
		return messages.find(msg => condition === msg.id)
	}else{
		return messages.filter(msg => condition === msg.type)
	}
}

searchMessage(1)?.id
searchMessage(MessageType.image).map(msg => ({...msg}))
// (searchMessage(2) as Message).type


// type UserData = {
// 	['id']: User['id']
// 	['name']: User['name']
// 	['age']: User['age']
// }

type Data = string | number | boolean extends string | number ? string : never

type ConditionData<T> = T extends string | number ? T : never
type Data1 = ConditionData<string | number | boolean>
type Data2 = Extract<string | number | boolean, string | number>

type Customer = {
	name: string
	age: number
	// [key: string]: any
}

type AppendProp<T> = {
	[PK in keyof T]: T[PK]
}
type Customer1 = AppendProp<Customer>

type AppendProp2<T, K extends string, V> = {
	[PK in keyof T | K]: PK extends keyof T ? T[PK] : V
}
type Customer2 = AppendProp2<Customer, 'address', string>

type AppendProp3<T, V extends object> = {
	[PK in keyof (T & V)]: PK extends keyof T ? T[PK] : PK extends keyof V ? V[PK] : never
}
type Customer3 = AppendProp3<Customer, { 'address': string }>
type Customer4 = Extract<Customer, { 'name': string }>

type StrTemp = `1`
type StrTemp2<T> = `${T}`
type StrTemp3<T> = `${T & string}`