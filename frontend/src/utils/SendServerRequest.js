export async function SendServerRequest(url,messages,newMessage,token) {
    let headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        messages: messages,
        user_input:newMessage,
        model_type:""
      }),
      headers:headers,
    });
  }