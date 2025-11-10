import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth-server";

export default async function Home() {
  const { user } = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
