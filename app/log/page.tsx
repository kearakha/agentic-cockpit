import { RunList } from "@/components/run-list";

export default function LogPage() {
  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl">Session log</h1>
      <RunList />
    </div>
  );
}
