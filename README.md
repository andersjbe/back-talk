# BackTalk

A place to share talks from tech conferences and get hyped about future conferences. Made for EdgeDB + Vercel Hackathon 4/26/2024-5/26/2024

## Todo

- [X] Create Edge DB and connect locally and on the cloud
- [X] Set up authentication flow
- [X] Successful initial deployment
- [X] Setup shadcn with custom theme
- [X] Create schemas for the different models like talk, conference, talk comment, conference post, conference member, etc.
- [ ] Setup UploadThing
- Talk recordings
  - [X] Create form for uploading new talks
  - [ ] Set up Youtube player to display recorded talks
  - [ ] Add comments for authenticated users on each video
  - [ ] Track views and likes on each video
  - [ ] Have a page for displaying the top 50 talks (by # of likes)
  - [X] Users can search for talks by different tags like "Javascript", "AI", "Informative", "Funny/entertaining"
  - [X] Users can also search by the speaker
  - [ ] Users can search by year and conference
  - [ ] *Bonus* If a talk transcript is included, it can be searched for with AI
- Conferences
  - [ ] Users can see a list of groups for previous/upcoming conferences.
  - [ ] For upcoming and current conferences, users can opt into sharing their contact info with other people in the group who are also interested in connecting (tinder rules)
  - [ ] Users can ask questions and post different memories from the conference.
  - [ ] Users can upload photos they can share as memories
- Users
  - [ ] Each user has a page that lists all of the conference groups they've attended
  - [ ] Add an option to connect a speaker profile to a user (Requires verification)
- [ ] Create a landing/home page with popular and recent talks
- [ ] Optimize and other considerations for production- Remove unnecessary console.logs, consider setting up upstash, security check, etc.