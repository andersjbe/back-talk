CREATE MIGRATION m1meek6v6ccq4tt3anathw4mhcdrszi4hrzxhxc5ybviufqh4kl6za
    ONTO m1ec4joghy56ecguevyukyhkw2e6k2g6vs2ypb2yzugkvygbtlv4oa
{
  ALTER TYPE default::Speaker {
      ALTER LINK talks {
          RESET EXPRESSION;
          RESET EXPRESSION;
          SET REQUIRED USING (<default::TalkRecording>{});
          SET TYPE default::TalkRecording;
      };
  };
  ALTER TYPE default::TalkRecording {
      DROP LINK speaker;
  };
  ALTER TYPE default::TalkRecording {
      CREATE LINK speakers := (.<talks[IS default::Speaker]);
  };
};
