const res = await fetch("https://valorant-api.com/v1/agents");
if (!res.ok) throw new Error("erro");

const data = await res.json();
console.log(data);
