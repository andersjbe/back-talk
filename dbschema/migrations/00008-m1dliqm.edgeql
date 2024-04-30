CREATE MIGRATION m1dliqmg4pbbncjd5sa7tyubvjvsjhm3ipxvu4c2izegl27lrm6giq
    ONTO m1radfmxjab5ulpzvzhpvviybg2psl7hbpn6s2guefzueuz5mtnzea
{
  ALTER TYPE default::Session {
      ALTER PROPERTY publicId {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY publicId {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
