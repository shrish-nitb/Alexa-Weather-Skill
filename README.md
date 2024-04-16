Advanced voice based weather bot hosted on Serverless AWS Lambda functions capable of processing well sophisticated prompts via Alexa powered NLU and trained GPT  3.5 Turbo for NLP, The application has Voice Based UI/UX, User Authentication facility and Session handling. Simply answering your queries related to weather, forecasts and other related stuff elaborated below in the usage instructions. Supports an array of voice features via Speech Synthesis Markup Language (SSML).

<p align="center"><img src="https://res.cloudinary.com/djjbjnrgl/image/upload/v1701933352/my_weather_soft.drawio_jtcehf.svg" alt="architecture"></p>

**Prerequisites**
1. Grant test access for your email form the author(shrish108@gmail.com) for BETA Testing.
2. Install it on your Alexa Device via Invite link sent on your email.
3. Invocation using "Alexa, Open my weather soft"
4. Say "Help"

# Usage Instructions

## Description

This skill allows you to check weather conditions and forecasts for any given location. Additionally, it helps you remember essential items like umbrellas, sunscreen, raincoat, or sweaters based on the weather. The skill features user authentication for personalized weather updates.

## Usage

1. **Invocation:**
   - Say "my weather soft" to invoke the skill.

2. **Login:**
   - Provide registered fullname and passkey when prompted.<br>
_Open credentials<br>
fullname - Shrish Shrivastava<br>
passkey - 1234<br>_

3. **Logged In:**
   - Once logged in, you can inquire about weather conditions without re-authentication.

4. **Switch Account:**
   - To switch accounts, say "goodbye" or "tata" then invoke the skill again.

5. **Exit Skill:**
   - Say "goodbye" to end the session and close the skill.



## Screenshots:
<p align="center"><img src="https://res.cloudinary.com/djjbjnrgl/image/upload/v1713280095/442c01ba0179affbe3643f8ca3211661-1_xrpdvu.png" alt="demo"></p>

<p align="center"><img src="https://res.cloudinary.com/djjbjnrgl/image/upload/v1713280096/442c01ba0179affbe3643f8ca3211661-2_t8uruu.png" alt="demo"></p>

<p align="center"><img src="https://res.cloudinary.com/djjbjnrgl/image/upload/v1713280097/442c01ba0179affbe3643f8ca3211661-0_h6qdmi.png" alt="demo"></p>

## Example Queries:

* *Weather in Jaipur.*
* *Humidity in Bhopal.*
* *Is an umbrella needed in Jaipur tomorrow?*
* *How will the weather be in Bhopal tomorrow?*
* *How does it feel in Bhopal today?*
* *Humidity status in Bhopal today.*
* *Humidity forecast for Bhopal tomorrow.*
* *Weather forecast for Bhopal tomorrow.*
* *Forecast for Jabalpur the day after tomorrow.*
* *Do I need to wear a sweater tomorrow in Goa?*
* *Should I apply sunscreen tomorrow in Bhopal?*
  <br>and many more...

**Note:**
- Session data is conserved after login until you say "goodbye."
- For Alexa-enabled devices with a screen, the session might be conserved for a short time with the microphone closed.
- Please provide a fully qualified city or state or country name with your queries.
- The program is still in BETA phase of development so You may encounter errors, warning, null or the program might not work as intended sometimes.
- LLM support is temporarily implemented without any dedicated API calls, which is later proposed to transform into API based for ensuring session longevity and concurrency.

Feel free to use and contribute to this weather assistant skill! Stay weather-ready!



