# HackThis2020

# Description
Apingo is a tool to be used alongside online lectures with a smaller class size of 20-30. With online lectures, student engagement with the teacher is limited to either the chat box linked to the lecture software or actual talking via the voice/video channel. However, many students are reluctant to turn on cameras or speak up in front of the entire class especially in an online setting. This leaves the chat software to be a messy primary way to engage with the students. Apingo helps to solve this problem by using a free response answer to help the teacher engage with the students as well as a ping function to let the teacher know if the student is unclear about their answer or a topic in general.
Youtube link for demo is at https://youtu.be/TxtxbHYAE3s

# Use
All functionality is hosted by Google Firebase Hosting, and the app can be accessed at https://apingo.web.app/
The teacher is able to host a room that the students can join, and the teacher asks students questions while the students can answer.
The Firebase SDK must be loaded (shown at the bottom) before functionality can begin

# Limitations with the project and further development
Currently, the class sizes are best suited for high school classes and college discussion lectures. Later, I'd like to develop a function for other students to vote or ping other students answers that they find interesting so that the teacher recieves only the interesting answers that can be further discussed. This way, classes of 200-300 students can use Apingo without the teacher being overwhelmed with pings and answers.
Furthermore, in the "Middle Room" podcast with Grant Sanderson of 3blue1brown, he discusses a problem with the Youtube lectures that he is doing where he is not able to parse through the youtube chat and find interesting questions. In the future, I would like to develop a way for students to ask questions as well as answer, using the function described above as a sorting element for engaging questions.
