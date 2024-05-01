import type { ActionResult } from "next/dist/server/app-render/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { lucia, validateRequest } from "~/lib/auth/lucia";

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export default async function HomePage() {
  const { user } = await validateRequest();

  return (
    <div className="container mx-auto ">
      <h1 className="mb-4 text-3xl font-bold">Welcome to BackTalk!</h1>
      {user ? (
        <form action={logout}>
          <h2> Hello {user.username}</h2>
          <Button variant="link" type="submit">
            Logout
          </Button>
        </form>
      ) : (
        <a href="/login/github">Sign In</a>
      )}
    </div>
  );
}
