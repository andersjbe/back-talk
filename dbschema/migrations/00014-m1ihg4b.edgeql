CREATE MIGRATION m1ihg4br3d7f7ghhwvknptx3qgfsumjt4xeb4wqoencireiro5hb5q
    ONTO m1biyglagvowznrihrr3mns2jtaikvxhskg6axzfm64ikdl73oipjq
{
  ALTER TYPE default::TalkRecording {
      ALTER LINK tags {
          RESET OPTIONALITY;
      };
  };
};
