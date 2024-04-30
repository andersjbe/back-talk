CREATE MIGRATION m17ce57726ryvpkx77dtfimq4klrgl37g5m2ozv6gnzjmzd2ygbc5a
    ONTO m124tcgh55cx3nulvq3ufufpjg2r6t2abynhbqwd42pwwhqzmzlf2a
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY githubId: std::int64 {
          SET REQUIRED USING (<std::int64>{});
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
