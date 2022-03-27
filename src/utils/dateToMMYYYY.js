export default function dateToMMYYYY(date) {
  let month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}/${year}`;
}
