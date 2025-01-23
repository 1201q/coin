export default async function Home() {
  const data = await fetch(
    "https://api.coingosu.live/upbit/candle/years?market=KRW-BTC&count=1"
  )
    .then((response) => {
      if (response.ok) {
        return response.json(); // 응답 본문을 JSON으로 파싱
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((jsonData) => {
      console.log(jsonData); // 실제 데이터 출력
      return jsonData;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
  console.log(data); // 데이터 출력

  return <div>{data ? data[0].trade_price : "없음"}</div>;
}
