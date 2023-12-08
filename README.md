# Alexa - my weather soft
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

## Example Queries:

- _Weather in Jaipur._
- _Humidity in Bhopal._
- _Wind speed in Bhopal today_
- _Wind Direction in Bhopal today_
- _Sunset in Jaipur today_
- _will it rain in Bhopal tomorrow?_
- _Is it going to rain in London tomorrow?_
- _What's the weather in sydney right now?_
- _Any snowfall expected in Berlin next week?_
- _How humid is it in Los Angeles today?_
- _Give me the weather update for Beijing this morning._
- _When will sunset in Sydney today?_
- _Tell me the sunrise in New York tomorrow_
- _Is an umbrella needed in Jaipur tomorrow_?
- _Will there be a temperature fall in Jaipur tomorrow?_
- _Any chance of a clear sky for stargazing in Goa tonight?_
- _What things should I keep with me in Bhopal?_
- _Temperature of Tokyo in afternoon tomorrow._
- _How will the weather be in Bhopal tomorrow?_
- _How does it feel in Bhopal today?_
- _Humidity status in Bhopal today._
- _Humidity forecast for Bhopal tomorrow._
- _Weather forecast for Bhopal tomorrow._
- _Forecast for Jabalpur the day after tomorrow._
- _Considering the weather of mumbai should I keep umbrella?_
- _Should I wear jacket in Shimla tomorrow?_
- _Should I travel out in Bangalore considering the weather?_
- _Considering the weather in Mumbai should I move out?_
- _Do I need to wear a sweater tomorrow in Goa?_
- _Should I apply sunscreen tomorrow in Bhopal?_
- _Considering the weather should I plan trip to Miami?_
- _Temperature of Tokyo tomorrow at six_
- _What items should I keep in visit to Mumbai tomorrow?_
  <br>and many more...

**Note:**
- Session data is conserved after login until you say "goodbye."
- For Alexa-enabled devices with a screen, the session might be conserved for a short time with the microphone closed.
- Please provide a fully qualified city or state or country name with your queries.
- The program is still in BETA phase of development so You may encounter errors, warning, null or the program might not work as intended sometimes.
- LLM support is temporarily implemented without any dedicated API calls, which is later proposed to transform into API based for ensuring session longevity and concurrency.

Feel free to use and contribute to this weather assistant skill! Stay weather-ready!



