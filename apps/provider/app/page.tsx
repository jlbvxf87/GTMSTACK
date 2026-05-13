import { redirect } from "next/navigation";

/** Root → always send providers into the queue (or /login if unauthenticated). */
export default function RootPage() {
  redirect("/queue");
}
