const apiKey = "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"
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);


 let corsOptions = {
     origin: 'http://127.0.0.1:5500/index.html',
     credentials: true
 }

app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/fortuneTell', async function (req, res) {  
    let {myDateTime, userMessages, assistantMessages} = req.body     

    let todayDateTime = new Date().toLocaleString("ko-kk", {timeZone: "Asia/Seoul"});

    console.log(userMessages);
    console.log(assistantMessages);
    let messages = [    
        {role: "system", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗비입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗비입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
        {role: "assistant", content: `저의 생년월일은 ${myDateTime}입니다`},
        {role: "assistant", content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!`},
    ]  

    while(userMessages.length != 0 || assistantMessages.length != 0){
        if(userMessages.length != 0){
           messages.push(
              JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
       }
       if(userMessages.length != 0){
           messages.push(
             JSON.parse('{"role": "assistant", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )   
       }
    }

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      messages: messages
    });        
    let fortune = completion.data.choices[0].message['content']
    
    res.json({"assistant": fortune});
  });

  module.exports.handler = serverless(app);

  //app.listen(3000)





