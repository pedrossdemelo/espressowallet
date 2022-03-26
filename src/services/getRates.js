export default async function getRates() {
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/json/all");
    if (!response.ok) {
      return {
        data: null,
        error: `Failed to fetch rates. Code: ${response.status}`,
      };
    }
    const data = await response.json();
    delete data.USDT;
    data.BRL = { ask: 1 };
    return { data, error: null };
  } catch (err) {
    const fallbackData = {
      USD: {
        ask: 4.75,
      },
    };

    return { data: fallbackData };
  }
}
