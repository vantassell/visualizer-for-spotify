// import { saveQueryParamsToUserData } from "./queryCheck";

// beforeEach(() => {
//
//   const jsdom = require("jsdom");
// const dom = new JSDOM(`<!DOCTYPE html><body><p id="main">My First JSDOM!</p></body>`);
// // This prints "My First JSDOM!"
// console.log(dom.window.document.getElementById("main").textContent);
//
//   // Mock window.location
//   delete window.location;
//   window = Object.create(window);
//   window.location = {};
//   window.location = {
//         ancestorOrigins: null,
//     hash: null,
//     host: 'dummy.com',
//     port: '80',
//     protocol: 'http:',
//     hostname: 'dummy.com',
//     href: 'http://dummy.com?page=1&name=testing',
//     origin: 'http://dummy.com',
//     pathname: null,
//     search: null,
//     assign: null,
//     reload: null,
//     replace: null,
//     toString: () => {
//       return window.location.href;
//     },
//   };
// });
//
// afterEach(() => {});
import { rewire } from 'rewire';
let app;

beforeEach(() => {
  someFunction();
  app = rewire("./queryCheck.js");
});

test("use jsdom in this test file", () => {
  const jsdom = require("jsdom");

  const { JSDOM } = jsdom;
  // const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
  // console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
  const { window } = new JSDOM(``, {
    url: "https://example.org/",
  });

  // const { document } = (new JSDOM(`...`)).window;;
  const getParamFromQuery = app.__get__("getParamFromQuery");
  expect(getParamFromQuery("page")).toBe({ page: 16 });
});
//
// test('checking Query parsing', () => {
//   expect(saveQueryParamsToUserData())
// })

// test("checking Query parsing", () => {
//   getParamFromQuery("page").toBe({ page: 16 });
// });
