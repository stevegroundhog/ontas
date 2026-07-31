import { createFileRoute } from "@tanstack/react-router";
import { WoprApp } from "@/components/WoprApp";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <WoprApp />;
}
