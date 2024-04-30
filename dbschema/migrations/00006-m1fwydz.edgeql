CREATE MIGRATION m1mte6r4vm7bbltlqxiprgw3ddogpcpfegs4oqjjin5sviwrhiygya
    ONTO m1xnkcc6pd5kc3mlr36gncmcnvhor6mk72ztmk7q5hswvxxzkduxoq
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY publicId: std::str {
          SET REQUIRED USING (<std::str>{"blank"});
      };
      CREATE INDEX ON (.publicId);
  };
};
