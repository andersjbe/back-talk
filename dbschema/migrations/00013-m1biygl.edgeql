CREATE MIGRATION m1biyglagvowznrihrr3mns2jtaikvxhskg6axzfm64ikdl73oipjq
    ONTO m1sdzulnunxz3hdrgfoncem6j6phyrypsthysxpn52qgup53zqymza
{
  ALTER TYPE default::Speaker {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
