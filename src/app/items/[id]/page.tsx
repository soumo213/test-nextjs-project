"use client";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") || "";
  return (
    <div className="imageContainer">
      <img src={imageUrl} alt="image" />
    </div>
  );
}
