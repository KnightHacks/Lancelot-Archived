export function choice<T>(list: T[]): T {
  const index = Math.floor(Math.random() * list.length);
  return <T>list[index];
}
