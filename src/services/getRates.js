export default async function getRates() {
  const response = await fetch('https://economia.awesomeapi.com.br/json/all');
  if (!response.ok) {
    return {
      data: null,
      error: `Failed to fetch rates. Code: ${response.status}`,
    };
  }
  const data = await response.json();
  delete data.USDT;
  return { data, error: null };
}
