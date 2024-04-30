CREATE MIGRATION m124tcgh55cx3nulvq3ufufpjg2r6t2abynhbqwd42pwwhqzmzlf2a
    ONTO m1h3vnh6qdhbrnsoadtvo56y4rkwvp2dpj5i6a26xugpsmr6v6be6q
{
  CREATE TYPE default::Session {
      CREATE REQUIRED PROPERTY expiresAt: std::datetime;
  };
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE INDEX ON (.email);
  };
  ALTER TYPE default::Session {
      CREATE REQUIRED LINK user: default::User {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK sessions := (.<user[IS default::Session]);
  };
};
