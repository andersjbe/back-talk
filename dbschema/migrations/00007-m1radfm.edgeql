CREATE MIGRATION m1radfmxjab5ulpzvzhpvviybg2psl7hbpn6s2guefzueuz5mtnzea
    ONTO m1mte6r4vm7bbltlqxiprgw3ddogpcpfegs4oqjjin5sviwrhiygya
{
  ALTER TYPE default::Session {
      CREATE REQUIRED PROPERTY publicId: std::str {
          SET REQUIRED USING (<std::str>{'blank'});
      };
      CREATE INDEX ON (.publicId);
  };
};
