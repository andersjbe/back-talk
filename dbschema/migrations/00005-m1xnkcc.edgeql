CREATE MIGRATION m1xnkcc6pd5kc3mlr36gncmcnvhor6mk72ztmk7q5hswvxxzkduxoq
    ONTO m17ce57726ryvpkx77dtfimq4klrgl37g5m2ozv6gnzjmzd2ygbc5a
{
  ALTER TYPE default::User {
      DROP INDEX ON (.email);
  };
  ALTER TYPE default::User {
      ALTER PROPERTY email {
          RENAME TO username;
      };
  };
  ALTER TYPE default::User {
      CREATE INDEX ON (.username);
  };
};
