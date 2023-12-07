import axios from "axios";

export const handler = async (event, context) => {
  console.log(event)
  let obj = JSON.parse(event.body);

  const concatenateValues = (obj) => {
    let concatenatedValue = "";
    for (let key in obj) {
      if (key == "slotValue" && obj[key]["type"] != "List") {
        continue;
      }

      if (typeof obj[key] == "object") {
        concatenatedValue += concatenateValues(obj[key]);
      } else {
        if (key == "value") {
           let c = obj[key]
          if(c == "MO"){c = "morning"}
          if(c == "NI"){c = "night"}
          if(c == "AF"){c = "afternoon"}
          if(c == "EV"){c = "evening"}
          concatenatedValue += c + " ";
        }
      }
    }
    return concatenatedValue;
  };

  let alexaValues = concatenateValues(obj);
  console.log(JSON.stringify(obj))
  //check for phrase
  //send to gpt and filter out city names
  //get weather data for each city and unify it
  //mix the phrase in the data
  //send it to gpt again
  //return the response of gpt to user after regex
  
  
  let loc = "New Delhi"
  if(obj.data.location){
    loc = obj.data.location.value
  } else {
    loc = obj.data['object.location.addressLocality.name'].value || obj.data['object.location.addressRegion.name'].value || obj.data['object.location.addressCountry.name'].value || "New Delhi";
  // if(obj.data.location.resolutions.resolutionsPerAuthority && obj.data.location.resolutions.resolutionsPerAuthority[0].values && (/^[a-zA-Z.,\-\s]*$/).test(obj.data.location.resolutions.resolutionsPerAuthority[0].values[0].value.name)){
  //   loc = obj.data.location.resolutions.resolutionsPerAuthority[0].values[0].value.name;
  // }
  }
  const options = {
    params: { q: loc, days: "3" },
    headers: {
      "X-RapidAPI-Key": "a496cf205dmsh4543dd70c951ab1p11ac39jsn55d415499a7f",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };
  try {
    let response = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/forecast.json",
      options
    );
    //remove hourly details from forecasted data in response.data to minify the json
    delete response.data.forecast.forecastday[0].hour;
    delete response.data.forecast.forecastday[1].hour;
    delete response.data.forecast.forecastday[2].hour;
    let apiResponse = JSON.stringify(response.data);
    let ask = "Form an interrogative sentence from these: "+  alexaValues;

    let data = JSON.stringify({
      prompt: {
        messages: [
          {
            role: "system",
            content:
              'You are the go-to person for all questions at an organization. \nAnswer questions based strictly on the context provided. \nDo not assume any prior knowledge and don\'t mention the existence of the contexts in your answer. \nIf you don\'t know the answer based on the given context, reply exactly "■DONT_KNOW".\n\nProvide your answer in the same language as the question and the context.\nProvide the source (e.g., [†X]) inline for every part of your answer. \nFormat answers similar to: "The price is $9.99 [†87], which is 40% higher than usual. [†91, †97]" \nIf the context provides a list or has specific formatting, follow that format in your answer.',
          },
          {
            role: "user",
            content:
              "Here's the conversation summary/transcript thus far:\n\n{{providedContext}}",
          },
          {
            role: "system",
            content:
              "Make sure to include the SOURCE ID to the pieces of context you used. Format to use: [†X] or [†Y, †Z, †W]\nDon't mention the existence of the contexts in your answer, instead, just add inline the relevant SOURCE ID.\n\nIf you don't know the answer, reply exactly \"■DONT_KNOW\".\nNever try to make up an answer.\nNever explain your answer.\nIf the answer is a list of items or steps, keep each item on a separate line and use bullet points or numbers (as used in the context).\nFormat your answer with bullet points if the source context uses bullet points.\nAvoid very lengthy paragraphs, instead, split your answer into separate paragraphs so it's easier for me to read and understand.\nWhen providing an URL or a link, make sure to use the full URL (eg: https://www.google.com) and to use markdown format (eg: [Google](https://www.google.com)).\nIf you are providing a link, make sure to include the SOURCE ID to the pieces of context you used (eg: [View Room](https://link-of-website.com/room-4567.html) [†X]).\nIf you don't know the answer, reply exactly \"■DONT_KNOW\".\n\nAdditional instructions:\n---\n{{passthrough}}\n---",
          },
          {
            role: "system",
            content:
              "Use the following pieces of context to answer the question at the end.\n\n---\n<|start of context|>\n{{context}}\n<|end of context|>\n---",
          },
          {
            role: "user",
            content:
              'Now, answer the following question based solely on the context items provided ({{sources}});\nIMPORTANT: \n- Only ever provide answers if and only if there is a relevant question below. If no question is relevant, reply exactly "■DONT_KNOW".\n- Always provide your answer in the same language as the question and the context.\n- ALWAYS provide the source (e.g., [†X]) inline for every part of your answer.\n\nPotential Question: "{{question}}"\nHelpful Answer:',
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0,
        signatureVersion: "Jun-2023",
      },
      variables: {
        question: ask,
        sources: "†0, †1, †2, †3, †4",
        passthrough: "n/a",
        providedContext:
          'Summary of the conversation:\n"""\n\n"""\n\nTranscript:\n"""\nuser: ask \n\n"""',
      },
      options: {
        truncate_order: [
          "context",
          "passthrough",
          "providedContext",
          "sources",
          "question",
        ],
        origin: "agents/KnowledgeAgent/0.3",
      },
      signature:
        "D7JhVYMNr+luavoo1svDHuZ3nFjoaPXWLcWz9PrXNRnzayTiK308zy91ypEy/dWPw4WXcblkDuvF+If7VuCsfw1Mw+tVK8Je0qzEC2sgrTwlnSBah8qXqaC5ZV44TTO4O/9xRjo1rSPHVhMrrCAJrSa/Fp7b8/jQ4BiP5ZQlFj1UXXWya0A4vtqqr0kq3ZY/MvdnGm7AnbTNp6ISYKhwRAGjXNME8UpVHxGDFOaUAqCz/zMmtIl513c/D1FVcmZTD4tWYiX/xdf+T3Jra7vX/6xvOMbpsdSE2l9thISSWtFuO0mbLm32ImAdFuERtB/qT0Ei2zCzuut7lo35eSHR8A==",
      origin: "agents/KnowledgeAgent/0.3",
    });

    let headers = {
      "X-Bot-Id": "a2da59a4-f832-4107-9a59-f6a5455edfb4",
      Cookie:"_gid=GA1.2.1862579935.1701727939; ps_mode=trackingV1; _hjSessionUser_2931810=eyJpZCI6IjAyOTU4YzUwLTI4YjUtNTM2Ni1hMTBjLTI0NTYxZDM0NDlmYiIsImNyZWF0ZWQiOjE3MDE3Mjc5Mzk1NzIsImV4aXN0aW5nIjp0cnVlfQ==; _gcl_au=1.1.253717387.1701750473; intercom-device-id-bjzkw2xf=ce394aa8-d089-4316-82d8-127670f5a740; _hjSessionUser_3339867=eyJpZCI6IjEyYzFmMjlhLTdiMjktNTVhZC05ZDJjLWJjYWQ0ODI4OTU4NCIsImNyZWF0ZWQiOjE3MDE3NTA0NjY2ODgsImV4aXN0aW5nIjp0cnVlfQ==; _hjIncludedInSessionSample_3339867=0; _hjSession_3339867=eyJpZCI6ImM0ZWE0NDExLWM2MDEtNDBkYS04ZDRjLTlkZTFiZjQzNDViYyIsImNyZWF0ZWQiOjE3MDE5MDM2ODQ0NTEsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6dHJ1ZX0=; _hjAbsoluteSessionInProgress=0; _hjIncludedInSessionSample_2931810=0; _hjSession_2931810=eyJpZCI6IjJiZjYyNzA1LTUxYmYtNGFhZS04NmIxLWRiZGRmMDAzNDg2NiIsImNyZWF0ZWQiOjE3MDE5MDM2OTA4ODgsImluU2FtcGxlIjpmYWxzZSwic2Vzc2lvbml6ZXJCZXRhRW5hYmxlZCI6ZmFsc2V9; csrf_token_bd9ac21c34b9f0915e733c3e5305d737d0722c1168be7376b889426b5ec2a298=+eDLkdQ6VTk46Tl9umkv+sxncpAyQQOEeKjPIdIZSrE=; ory_kratos_session=MTcwMTkwMzY5OXxBSUFlTVVucUh6Yk5qSkpOaDVHalpQX3Eycl9SU2RxLUo2QThvZnVxSExZVzZ6VkZKVU82T2ZBVjhWTmtBa3l0bFIwTUJSUWxhWlhDMVZSb0FaTFkxampBU0UzbUU5cEFZWlNNbHJPd3BxSUtyeEVtdFJOTFE1RGJ6Sm1vaWlNQUtFS0s4RnlnTW5JU0F3SHlUTVgyUVplLXFjWmZwWTVjU0FaNFRncEtublphbEhRMFM4cUZCUDBPcFVSMXNtQjA5OVVqYjZ1b3pXcllYakJfSTkxYmxVNUttSjFRQ3Vpb0hQLUtJSnNveXExLVRLeVpIeWlxOHY4MlU4UTVsZ1o1a2tyUUN1dGtqcE9faXBrYktncmViZz09fFqNjQpn0h6NFkwZd4L16RCzKDnZxwy5beetAZEPV6v0; ajs_user_id=285ecb9c-bde2-4ced-9306-54ec2e79c41e; _ga_PCC6TBWJY6=GS1.1.1701903690.12.1.1701903756.0.0.0; _ga_HKHSWES9V9=GS1.1.1701903690.9.1.1701903756.0.0.0; _ga=GA1.2.421126037.1701727934; _ga_W6YT9YSNLH=GS1.2.1701903691.9.1.1701903756.0.0.0; _ga_CYSS87Q508=GS1.2.1701903691.9.1.1701903756.0.0.0; ajs_anonymous_id=f23a08b3-8221-44d8-b904-2a1c321bf628; intercom-session-bjzkw2xf=ajN1SkExMzNWZkNSd2NDTFI3R1orNG55dXhWdld2c3FxOHRqWS92TUErVzUzbzhlTTdkZE5rS1NiVlFuKzFQMy0tS2xEcERMS2ZObnV5ZE9mNzVZVkhIZz09--343af12cdbc42cfd8dbfc398c539b218391a2e2b" ,"Content-Type": "application/json",
    };

    response = await axios.post(
      "https://api.botpress.cloud/v1/cognitive/chat-gpt/query",
      data,
      {
        headers,
        maxBodyLength: Infinity,
      }
    );
    let ask2 = (JSON.stringify(JSON.parse(apiResponse), null, 2) +"\n"+ alexaValues)
    if(!(JSON.stringify(response.data.result).includes("DONT_KNOW"))  && response.data.result.toString().length <= 12){
       ask2 = (JSON.stringify(JSON.parse(apiResponse), null, 2) +"\n"+ JSON.stringify(response.data.result).replace(/\s*\[†\d+\]/g, '').replace(/\[†[0-9]+(, ?†[0-9]+)*\]/g, ''));
   } 
   ask2 += " mention state and country name in answer if you know"
    data = JSON.stringify({
      prompt: {
        messages: [
          {
            role: "system",
            content:
              'You are the go-to person for all questions at an organization. \nAnswer questions based strictly on the context provided. \nDo not assume any prior knowledge and don\'t mention the existence of the contexts in your answer. \nIf you don\'t know the answer based on the given context, reply exactly "■DONT_KNOW".\n\nProvide your answer in the same language as the question and the context.\nProvide the source (e.g., [†X]) inline for every part of your answer. \nFormat answers similar to: "The price is $9.99 [†87], which is 40% higher than usual. [†91, †97]" \nIf the context provides a list or has specific formatting, follow that format in your answer.',
          },
          {
            role: "user",
            content:
              "Here's the conversation summary/transcript thus far:\n\n{{providedContext}}",
          },
          {
            role: "system",
            content:
              "Make sure to include the SOURCE ID to the pieces of context you used. Format to use: [†X] or [†Y, †Z, †W]\nDon't mention the existence of the contexts in your answer, instead, just add inline the relevant SOURCE ID.\n\nIf you don't know the answer, reply exactly \"■DONT_KNOW\".\nNever try to make up an answer.\nNever explain your answer.\nIf the answer is a list of items or steps, keep each item on a separate line and use bullet points or numbers (as used in the context).\nFormat your answer with bullet points if the source context uses bullet points.\nAvoid very lengthy paragraphs, instead, split your answer into separate paragraphs so it's easier for me to read and understand.\nWhen providing an URL or a link, make sure to use the full URL (eg: https://www.google.com) and to use markdown format (eg: [Google](https://www.google.com)).\nIf you are providing a link, make sure to include the SOURCE ID to the pieces of context you used (eg: [View Room](https://link-of-website.com/room-4567.html) [†X]).\nIf you don't know the answer, reply exactly \"■DONT_KNOW\".\n\nAdditional instructions:\n---\n{{passthrough}}\n---",
          },
          {
            role: "system",
            content:
              "Use the following pieces of context to answer the question at the end.\n\n---\n<|start of context|>\n{{context}}\n<|end of context|>\n---",
          },
          {
            role: "user",
            content:
              'Now, answer the following question based solely on the context items provided ({{sources}});\nIMPORTANT: \n- Only ever provide answers if and only if there is a relevant question below. If no question is relevant, reply exactly "■DONT_KNOW".\n- Always provide your answer in the same language as the question and the context.\n- ALWAYS provide the source (e.g., [†X]) inline for every part of your answer.\n\nPotential Question: "{{question}}"\nHelpful Answer:',
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0,
        signatureVersion: "Jun-2023",
      },
      variables: {
        question: ask2,
        sources: "†0, †1, †2, †3, †4",
        passthrough: "n/a",
        providedContext:
          'Summary of the conversation:\n"""\n\n"""\n\nTranscript:\n"""\nuser: '+ask2+' \n\n"""',
      },
      options: {
        truncate_order: [
          "context",
          "passthrough",
          "providedContext",
          "sources",
          "question",
        ],
        origin: "agents/KnowledgeAgent/0.3",
      },
      signature:
        "D7JhVYMNr+luavoo1svDHuZ3nFjoaPXWLcWz9PrXNRnzayTiK308zy91ypEy/dWPw4WXcblkDuvF+If7VuCsfw1Mw+tVK8Je0qzEC2sgrTwlnSBah8qXqaC5ZV44TTO4O/9xRjo1rSPHVhMrrCAJrSa/Fp7b8/jQ4BiP5ZQlFj1UXXWya0A4vtqqr0kq3ZY/MvdnGm7AnbTNp6ISYKhwRAGjXNME8UpVHxGDFOaUAqCz/zMmtIl513c/D1FVcmZTD4tWYiX/xdf+T3Jra7vX/6xvOMbpsdSE2l9thISSWtFuO0mbLm32ImAdFuERtB/qT0Ei2zCzuut7lo35eSHR8A==",
      origin: "agents/KnowledgeAgent/0.3",
    });
    console.log(data)
    let response2 = await axios.post(
      "https://api.botpress.cloud/v1/cognitive/chat-gpt/query",
      data,
      {
        headers,
        maxBodyLength: Infinity,
      }
    );
  const output = {
      statusCode: 200,
      body: response2.data.result,
    };
    if(response2.data.result.toString().includes("DONT_KNOW") && response2.data.result.toString().length <= 12){
      output.body = [`hmm it's tough. say like, "my weather soft tell ....."`]
    }
    console.log(output)
    return output;
  } catch (error) {
    const output = {
      error,
    };
     console.log(output)
    return output;
  }
};