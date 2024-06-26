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
    multi vieweRecordings: TalkRecording {
      liked: bool {
         default := false;
       }
       lastViewed: datetime {
         default := datetime_current();
       }
    }

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

  type Speaker {
    required name: str {
      constraint exclusive;
    }
    positionTitle: str;
    xHandle: str;
    linkedinHandle: str;

    talk := .<speakers[is TalkRecording];
  }

  type TalkRecording {
    required title: str;
    description: str;
    required videoUrl: str;
    required year: int32;
    required length: duration;
    createdAt: datetime {
      default := datetime_current();
    }

    required multi speakers: Speaker;
    multi tags: TalkTag;
    userViews := .<vieweRecordings[is User];
  }

  type TalkTag {
    required name: str {
      constraint exclusive;
    }

    talks := .<tags[is TalkRecording];
  }
}
