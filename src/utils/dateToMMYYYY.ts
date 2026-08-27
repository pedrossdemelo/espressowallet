export default function dateToMMYYYY(date: Date): string {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}/${year}`;
}
