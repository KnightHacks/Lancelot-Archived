function sayHello(): string {
  return 'Hello World';
}

test('A sample test', () => {
  expect(sayHello()).toBe('Hello World');
});
