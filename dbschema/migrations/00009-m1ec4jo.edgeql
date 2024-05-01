CREATE MIGRATION m1ec4joghy56ecguevyukyhkw2e6k2g6vs2ypb2yzugkvygbtlv4oa
    ONTO m1dliqmg4pbbncjd5sa7tyubvjvsjhm3ipxvu4c2izegl27lrm6giq
{
  CREATE TYPE default::Speaker {
      CREATE PROPERTY linkedinHandle: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY positionTitle: std::str;
      CREATE PROPERTY xHandle: std::str;
  };
  CREATE TYPE default::TalkRecording {
      CREATE REQUIRED LINK speaker: default::Speaker;
      CREATE PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY length: std::duration;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY videoUrl: std::str;
      CREATE REQUIRED PROPERTY year: std::int32;
  };
  ALTER TYPE default::Speaker {
      CREATE MULTI LINK talks := (.<speaker[IS default::TalkRecording]);
  };
  CREATE TYPE default::TalkTag {
      CREATE MULTI LINK talks: default::TalkRecording;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::TalkRecording {
      CREATE LINK tags := (.<talks[IS default::TalkTag]);
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK vieweRecordings: default::TalkRecording {
          CREATE PROPERTY lastViewed: std::datetime {
              SET default := (std::datetime_current());
          };
          CREATE PROPERTY liked: std::bool {
              SET default := false;
          };
      };
  };
  ALTER TYPE default::TalkRecording {
      CREATE LINK userViews := (.<vieweRecordings[IS default::User]);
  };
};
