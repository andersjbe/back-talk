CREATE MIGRATION m1sdzulnunxz3hdrgfoncem6j6phyrypsthysxpn52qgup53zqymza
    ONTO m1gwfbk5ojcgcouovvgqimqwiquvx6crknsua7gquucymhdo5g6kfa
{
  ALTER TYPE default::TalkRecording {
      ALTER LINK speakers {
          RESET EXPRESSION;
          RESET EXPRESSION;
          SET MULTI;
          SET REQUIRED USING (<default::Speaker>{});
          SET TYPE default::Speaker;
      };
  };
  ALTER TYPE default::Speaker {
      CREATE LINK talk := (.<speakers[IS default::TalkRecording]);
  };
  ALTER TYPE default::Speaker {
      DROP LINK talks;
  };
};
