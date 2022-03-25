export default function getMonthRange(date) {
  const start = new Date(date.getTime());
  const end = new Date(date.getTime());

  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(0, 0, 0, 0);

  return { start, end };
}
