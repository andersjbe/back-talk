import { Client } from "edgedb";
import { Adapter, DatabaseSession, DatabaseUser } from "lucia";
import e from "~/edgeql-js";

export class EdgeDBAdapter implements Adapter {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async getSessionAndUser(
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    console.log("getSessionAndUser");
    const session = await e
      .select(e.Session, (session) => ({
        id: true,
        publicId: true,
        expiresAt: true,
        user: {
          id: true,
          publicId: true,
          githubId: true,
          username: true,
        },
        filter_single: e.op(session.publicId, "=", sessionId),
      }))
      .run(this.client);
    if (!session) {
      return [null, null];
    }
    return [
      {
        id: session.publicId,
        expiresAt: session.expiresAt,
        userId: session.user.publicId,
        attributes: {
          internalId: session.id,
        },
      },
      {
        id: session.user.publicId,
        attributes: {
          internalId: session.user.id,
          githubId: session.user.githubId,
          username: session.user.username,
        },
      },
    ];
  }

  async getUserSessions(userId: string): Promise<DatabaseSession[]> {
    console.log("getUserSessions");
    const sessions = await e
      .select(e.Session, (s) => ({
        id: true,
        publicId: true,
        expiresAt: true,
        user: {
          publicId: true,
        },
        filter: e.op(s.user.publicId, "=", userId),
      }))
      .run(this.client);
    return sessions.map((s) => {
      return {
        attributes: {
          internalId: s.id,
        },
        expiresAt: s.expiresAt,
        id: s.publicId,
        userId: s.user.publicId,
      };
    });
  }

  async setSession(session: DatabaseSession): Promise<void> {
    console.log("setSession");
    await e
      .insert(e.Session, {
        id: session.attributes.internalId,
        publicId: session.id,
        expiresAt: session.expiresAt,
        user: e.select(e.User, (u) => ({
          filter_single: e.op(u.id, "=", e.uuid(session.userId)),
        })),
      })
      .run(this.client);
  }

  async updateSessionExpiration(
    sessionId: string,
    expiresAt: Date,
  ): Promise<void> {
    console.log("updateSessionExpiration");
    await e
      .update(e.Session, (s) => ({
        filter_single: e.op(s.publicId, "=", sessionId),
        set: {
          expiresAt: expiresAt,
        },
      }))
      .run(this.client);
  }

  async deleteSession(sessionId: string): Promise<void> {
    console.log("deleteSession");
    await e
      .delete(e.Session, (s) => ({
        filter_single: e.op(s.publicId, "=", sessionId),
      }))
      .run(this.client);
  }

  async deleteUserSessions(userId: string): Promise<void> {
    console.log("deleteUserSessions");
    await e
      .delete(e.Session, (s) => ({
        filter: e.op(s.user.publicId, "=", userId),
      }))
      .run(this.client);
  }

  async deleteExpiredSessions(): Promise<void> {
    console.log("deleteExpiredSessions");
    await e
      .delete(e.Session, (s) => ({
        filter: e.op(s.expiresAt, "<=", e.datetime_current()),
      }))
      .run(this.client);
  }
}
