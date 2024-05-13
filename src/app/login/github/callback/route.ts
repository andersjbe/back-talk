import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import e, { createClient } from "~/edgeql-js";
import { lucia } from "~/lib/auth/lucia";
import { github } from "~/lib/auth/providers";

const client = createClient();

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !storedState || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResp = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GithubUser = await githubUserResp.json();

    const existingUser = await e
      .select(e.User, (u) => ({
        id: true,
        filter_single: e.op(u.githubId, "=", githubUser.id),
      }))
      .run(client);

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {
        internalId: randomUUID(),
      });
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    const newUser = await e
      .insert(e.User, {
        githubId: Number(githubUser.id),
        username: githubUser.login,
        publicId: userId,
      })
      .run(client);

    const session = await lucia.createSession(userId, {
      internalId: randomUUID(),
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
  }
  return new Response(null, {
    status: 500,
  });
}

interface GithubUser {
  id: string;
  login: string;
}
