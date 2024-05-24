import { name } from '../package.json'
const data: string = '123'
console.log(data, name)

// type UserName = { name: string }

// const data1: UserName & string = { name: '1' }

// const data2: string & boolean

// type Num = 1 | 2 | 3
// const data3: Num = 3

// enum Roles {
//   owner = 3,
//   maintainer,
//   developer,
// }

// const a = Roles[4]
// const b = Roles[3]

// enum ApprovalStatusTips {
// 	dealing = 'deal with {role}',
// 	waiting = 'waiting for {role}',
// 	complete = 'complete'
// }

// const c = ApprovalStatusTips.complete
// const d = ApprovalStatusTips[1]

// const data3: unknown = ['2']
// const data3: any = 2
// const data3: any = undefined
// const data4: string[] = data3

// const data1: string[] = ['1']
// // const data1: number = 1
// // const data1 = undefined 
// const data2: unknown = data1

// function printDataIdx0(data: unknown) {
// 	console.log(data[0])
// }

// const data1: string & boolean = 1 // error: Type 'number' is not assignable to type 'never'

// interface User {
// 	name: string
// 	age: number
// 	[key: string]: any
// }

// const user: User = {
//   name: '1',
//   age: 2,
//   [Symbol('user')]: 'user symbol',
//   1: 2,
//   true: 1,
//   [new Set('1')]: 1
// }

const Id = Symbol('user')

interface User {
	[Id]: string | number
	name: string
	age: number
}

type UserName = User['name']
type UnionUserNameWithAge = User['name' | 'age']
type UserUId = User[typeof Id]

// type UserKeys = keyof User
// const data1: UserKeys = 'name'

type Keys<T> = T extends any ? T : never
type UserKeys = Keys<keyof User>
const data1: UserKeys = 'age'

// let data2: string = undefined

// function callback(data: string | undefined) {}
// callback()

// const user = { name: '1', age: 2 }
// let userNameSign = 'name'
// const userName = user[userNameSign]