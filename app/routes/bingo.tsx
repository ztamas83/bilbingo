import { useAiWordGenerator } from "~/hooks/AiWordGenerator";
import CarBingo from "../CarBingo/CarBingo";

export default function BingoRoute() {
  const { words, error } = useAiWordGenerator(36);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!words) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Car Bingo</h1>
      <CarBingo customItems={words} />
    </div>
  );
}
