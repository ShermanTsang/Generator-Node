import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// import Pkg from 'pkg';
// console.log(Pkg);

const test: Example.SingleItem = {
    name: '1'
};

setTimeout(() => {
    console.log(5);
}, 50000);

console.log(test);
console.log(process.env.NODE_ENV);
console.log(process.env.TEST_KEY);
