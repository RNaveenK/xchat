import 'htmx';

import { handleRegistration } from './app/handler/Register';
import {handleLogin} from './app/handler/Login';

const server = Bun.serve({
    port: 3021,
    async fetch(req,server) {
        const url = new URL(req.url);
        if(url.pathname === "/styles.css ") return new Response(Bun.file('styles.css',{ type: "text/css" }));
        if(url.pathname === "/") return new Response(Bun.file('app/ui/home.html'));
        if(url.pathname === "/signin") return new Response(Bun.file('app/ui/signIn.html'));
        if(url.pathname === "/signup")return new Response(Bun.file('app/ui/signUp.html'));
        if(url.pathname === "/chat") return new Response(Bun.file('app/ui/chat.html'));
        if(url.pathname === "/back") return new Response(Bun.file('app/ui/home.html'));
        if(url.pathname === "/register") return await handleRegistration(req);
        if(url.pathname === "/login") return await handleLogin(req);

        if(url.pathname === "/chatroom") {
            if (server.upgrade(req)) {
                console.log("upgrading re:",req)
                return; 
              }
              return new Response("Upgrade failed :(", { status: 500 });
        }
        return new Response("404!");
        
    },
    websocket: {
        async message(ws, message:any) {
                console.log("message got: ",message);
                let msg='';
                try {
                    const jsonObject = JSON.parse(message);
                    msg = jsonObject.chat_text;
                  
                  } catch (error) {
                    console.error("Error parsing JSON:", error);
                  }
                console.log("msg: ",msg)
                if (msg.includes('>') && msg.includes('<') && msg.includes("</")){
                  msg = msg.replace(new RegExp(/[<>]/g, "g"),' ');
                  console.log("inside msg: ",msg)
                }
                let htmlMsg = `
                <div style="color:white;" 
                id="chat_room" hx-swap-oob="beforeend">
                ${msg}
                <br>
                </div>`;
        
                msg && ws.send(htmlMsg);
                msg && ws.publish('chat', htmlMsg);
        },  
        open(ws) {
            // ws.subscribe('chat');
            console.log("socker connection opened");
        },  
        close(ws, code, message) {},  
        drain(ws) {},  
      },
  });
  
  console.log(`Listening on http://localhost:${server.port} ...`);



