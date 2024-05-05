CREATE MIGRATION m1gwfbk5ojcgcouovvgqimqwiquvx6crknsua7gquucymhdo5g6kfa
    ONTO m1meek6v6ccq4tt3anathw4mhcdrszi4hrzxhxc5ybviufqh4kl6za
{
  ALTER TYPE default::TalkRecording {
      ALTER LINK tags {
          RESET EXPRESSION;
          RESET EXPRESSION;
          SET MULTI;
          SET REQUIRED USING (<default::TalkTag>{});
          SET TYPE default::TalkTag;
      };
  };
  ALTER TYPE default::TalkTag {
      ALTER LINK talks {
          USING (.<tags[IS default::TalkRecording]);
          RESET CARDINALITY;
      };
  };
};
