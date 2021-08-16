import { useRouter } from "next/router";
import { useEffect } from "react";

const Mastery = () => {
  const {
    push,
    query: { summonerName },
  } = useRouter();

  useEffect(() => {
    if (summonerName && !Array.isArray(summonerName)) {
      push(`/mastery/${encodeURIComponent(summonerName)}`);
    }
  }, [push, summonerName]);

  return <p>Post: {summonerName}</p>;
};

export default Mastery;
