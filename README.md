## PrepSmart AI

## Inspiration
Our inspiration for creating PrepSmart came from our personal experiences. We realized the importance of effective communication skills during job interviews. Many candidates, despite having the right qualifications, struggle to articulate their thoughts clearly and concisely which often leads to missed opportunities. We sought to build a tool that could help individuals practice and improve their interview responses by providing instant feedback tailored to the interviewee’s response. 

## What it does
**PrepSmart AI is an AI interview coach that helps you elevate your career by providing tailored interview coaching advice for your interview practices. 💡**

Users enter a list of interview questions into the practice sets and tailor their interview prep question sequence according to their preparation needs. Our real-time speech-to-text recognition intakes user voice response as they speak, and this helps simulate the scenario of an actual interview where an interviewee has to articulate a response right on the spot. So our PrepSmart AI interview coach not only helps you hone your responses, it also helps users to be spontaneous, flexible and adaptive in an interview to create a dynamic and engaging dialogue.

The AI interview coach will evaluate the user’s response and provide feedback, not only giving advice on wording but also the overall structure of speech. Our PrepSmart AI interview coach will prompt users to provide more vivid examples, or restructure the wording and the speech to make the example sound more impactful. 

PrepSmart is built with the user’s career success in mind. We only succeed when our users do!

## How we built it
For the frontend, we used Next.js to build a clean, simple interface. Two major tasks for the backend include the implementation of the core features of our application which involve Cohere’s command-nightly chat API and the Mozilla Web Speech API. After implementing each API to work separately, we then had to integrate the Cohere chat API with our speech-to-text API in order for our AI interview coach to give instant feedback to users' spoken responses.

## Challenges we ran into
Our backend struggled with integrating Cohere’s chat API with Mozilla Web Speech API. Implementing the APIs separately was a straightforward process, but using our APIs together to perform joint functionality was out of our comfort zone. We ran into problems when we were trying to input the result of speech recognition as the prompt of our AI chat prompt. Also due to the focus of our platform, we would like the response generated from the AI chat to be career preparation and interview focused, so we also had to pre-prompt in our code in order to control the scope of the response generated.

As a team of four developers, we struggled quite a bit with the design of our application. Fixing our interface to appear as desired was also a challenge for us. We ran into problems in styling with CSS and also form submission. 

## Accomplishments that we're proud of
- Integrating the Mozilla Web Speech API for speech-to-text recognition.
- Incorporating the Cohere Command-Nightly Chat API for the AI interview coach.
- Developing the UI design to create an intuitive and user-friendly interview preparation experience.

