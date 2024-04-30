module default {
  type User {
    required publicId: str {
      constraint exclusive;
    }
    required username: str;
    required githubId: int64 {
      constraint exclusive;
    }
    multi sessions := (.<user[is Session]);

    index on (.username);
    index on (.publicId)
  }

  type Session {
    required publicId: str {
      constraint exclusive;
    }
    required expiresAt: datetime;
    required user: User {
      on target delete delete source;
    }

    index on (.publicId)
  }

}
