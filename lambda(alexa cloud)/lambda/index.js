/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require("ask-sdk-core");
const axios = require("axios");

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
      let speakOutput = `<s>Welcome to <phoneme alphabet="ipa" ph="zɔːrweɪ">Zorway</phoneme> Global.<break time="1s"/> May I know your fullname </s>`;
    //   if(handlerInput.requestEnvelope.request.locale === 'en-IN'){
    //       speakOutput += '<s><say-as interpret-as="interjection">balle balle</say-as></s>'
    //   }
  
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const byeIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "byeIntent"
    );
  },
  handle(handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({});
    const speakOutput = "Signed out, Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({});
    const speakOutput = `You can invoke the skill saying "my weather soft" and, exit saying "goodbye"... After invocation to Login, speak the registered fullname then passkey when asked... Once you are logged in, to switch account say "goodbye" or "tata" and re-invoke the skill... \n
This skill can be used to determine weather conditions, 3 days forecasts of any given location and it also keeps you from forgetting your umbrella, sunscreen or sweater.  \n
You can ask it...
Weather in Jaipur.
Humidity in Bhopal.
Is Umbrella needed in Jaipur tomorrow?
How will the weather be in bhopal tomorrow?
How it feels in bhopal today?
How is Humidity in bhopal today?
How will humidity be in bhopal tomorrow?
What is forecast for bhopal tomorrow?
Forecast for Jabalpur day after tomorrow?
Do I need to wear sweater tomorrow in Goa?
Should I apply sunscreen tomorrow in bhopal? \n

Note: The session keeps running for some interval after logging in unless you say "goodbye" so you not need to verify everytime`
    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
  },
};

const NameSpokenIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "NameSpoken"
    );
  },
  handle(handlerInput) {
    if(!handlerInput.requestEnvelope.session.attributes.fullname){
    const fullname =
      handlerInput.requestEnvelope.request.intent.slots.fullname.value;

    handlerInput.attributesManager.setSessionAttributes({
      fullname: fullname,
      isVerified: false,
    });
    let speakOutput =
      "Namastey! " +
      fullname +
      "<break time='1s'/> nice having you here, May I know the 4 digit Passkey assigned to you?";
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
    } else {
         let speakOutput = handlerInput.requestEnvelope.session.attributes.fullname + " sorry, I didn't get that. If you want to switch user then say 'bye' and re-invoke skill, else you can ask me weather."
         return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
    }
  },
};

const PasskeySpokenIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "PasskeySpoken"
    );
  },
  handle(handlerInput) {
    let fullname = handlerInput.requestEnvelope.session.attributes.fullname;
    let speakOutput = "Wrong Passkey or Name. Try another passkey " + fullname;

    if (!fullname) {
      speakOutput = "Please tell me your name first.";
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

    if (handlerInput.requestEnvelope.session.attributes.isVerified) {
      speakOutput =
        "You're already verified, to signout of account say 'bye' then re-invoke the skill.";

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

    let passkey =
      handlerInput.requestEnvelope.request.intent.slots.passkey.value;
    handlerInput.attributesManager.setSessionAttributes({
      fullname: fullname,
      isVerified: false,
    });

    let isVerified = verify(handlerInput, passkey);

    if (isVerified) {
        let speakOutput = ''
        if(handlerInput.requestEnvelope.request.locale === 'en-IN'){ 
          speakOutput += "<s><say-as interpret-as='interjection'>balle balle</say-as></s> "
      } else {
          speakOutput += "<s><say-as interpret-as='interjection'>Well Done</say-as></s> "
      }
      speakOutput += "<s>You're verified, You can ask me weather reports.</s>";

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const verify = (handlerInput, passkey) => {
  const { isVerified, fullname } =
    handlerInput.attributesManager.getSessionAttributes();

  if (isVerified === true) {
    return true;
  }

  if (
    (fullname.toLowerCase() === "shrish shrivastava"  ||
     fullname.toLowerCase() === "sai varun" ||
     fullname.toLowerCase() === "pawan raj verma" ||
     fullname.toLowerCase() === "hemant lodha") && passkey === "1234")
   {
    handlerInput.attributesManager.setSessionAttributes({
      isVerified: true,
      fullname: fullname,
    });
    return true;
  }

  return false;
};

//for forecast endpoint
const WeatherForecastIntentHandler = {
    canHandle(handlerInput){
        return(
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"&&(
               Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.SearchAction<object@WeatherForecast>" ||
               Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.SearchAction<object@WeatherForecast[temperature]>" ||
               Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.SearchAction<object@WeatherForecast[weatherCondition]>" 
            )
        )
    },
    async handle(handlerInput){
     const { fullname, isVerified } =
      handlerInput.requestEnvelope.session.attributes;
  
    let speakOutput = "";

    if (!isVerified && !fullname) {
      speakOutput =
        "Complete the verification process first. Please tell me your name.";

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    } else if (!isVerified) {
      speakOutput = fullname + ", please tell me the 4 digit passkey.";

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

    const slots =
      handlerInput.requestEnvelope.request.intent.slots;
      
    try {
      let response = await axios.post( 'https://gb2ocqgu57djihtiwrbt3zyfki0sucpp.lambda-url.eu-north-1.on.aws/',{data:slots})
      const d = response.data;
      speakOutput = d.toString().replace(/\s*\[†\d+\]/g, '').replace(/\[†[0-9]+(, ?†[0-9]+)*\]/g, '');
    } catch (error) {
      speakOutput = "Internal server error"+error.message;
      if (error.message === "Request failed with status code 400") {
        speakOutput = "Location not found, please try another.";
      }
    }
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
    }
}

const WeatherIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === "WeatherIntent" )
       
    );
  },
  async handle(handlerInput) {
    const { fullname, isVerified } =
      handlerInput.requestEnvelope.session.attributes;
    //   let options = {
    //       method: 'get',
    //       maxBodyLength: Infinity,
    //       url: 'https://api.eu.amazonalexa.com/v2/accounts/~current/settings/Profile.name',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer '+ handlerInput.requestEnvelope.context.System.apiAccessToken
    //       }
    //     };
    //      let profileName
    //     try{
    //         let response = await axios.request(options);
    //         profileName = response.data
    //     }catch(error){
    //         profileName = "err";
    //     }
    //      let speakOutput = `${profileName} is unauthorized to use the skill`;

    //     if(profileName !== "Shrish Shrivastava"){
    //         return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    //     }
    let speakOutput = "";

    if (!isVerified && !fullname) {
      speakOutput =
        "Complete the verification process first. Please tell me your name.";

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    } else if (!isVerified) {
      speakOutput = fullname + ", please tell me the 4 digit passkey.";

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }

    const slots =
      handlerInput.requestEnvelope.request.intent.slots;
      
    try {
      let response = await axios.post( 'https://gb2ocqgu57djihtiwrbt3zyfki0sucpp.lambda-url.eu-north-1.on.aws/',{data:slots})
      const d = response.data;
      speakOutput = d.toString().replace(/\s*\[†\d+\]/g, '').replace(/\[†[0-9]+(, ?†[0-9]+)*\]/g, '');
    } catch (error) {
      speakOutput = "error ";
      if (error.message === "Request failed with status code 400") {
        speakOutput = "Location not found, please try another.";
      }
    }
    
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({});
    const speakOutput = "Signed out, Goodbye!";

    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};
const customFallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "customFallback"
    );
  },
  handle(handlerInput) {
    let fullname =
      handlerInput.requestEnvelope.request.intent.slots.fullname.value;
    let location =
      handlerInput.requestEnvelope.request.intent.slots.location.value;
    if (location) {
      return WeatherIntentHandler.handle(handlerInput);
    } else if (fullname) {
        if(!handlerInput.requestEnvelope.session.attributes.fullname){
            return NameSpokenIntentHandler.handle(handlerInput);
        }
        let speakOutput = handlerInput.requestEnvelope.session.attributes.fullname + " sorry, I didn't get that. If you want to switch user then say 'bye' and re-invoke skill else you can ask me weather."
         return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
    }
  },
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "Sorry, Please clarify what you want to know. ";
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    console.log(
      `~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
    );
    // Any cleanup logic goes here.
    handlerInput.attributesManager.setSessionAttributes({});
    return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
  },
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again. " +
      error.message;
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    byeIntentHandler,
    customFallbackIntentHandler,
    NameSpokenIntentHandler,
    PasskeySpokenIntentHandler,
    WeatherForecastIntentHandler,
    WeatherIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent("sample/hello-world/v1.2")
  .lambda();
