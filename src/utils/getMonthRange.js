export default function getMonthRange(date) {
  const start = new Date(date.getTime());
  const end = new Date(date.getTime());

  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
