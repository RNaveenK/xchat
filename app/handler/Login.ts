import { login } from '../db/database';

export async function handleLogin(req: Request) {
    const body = await req.formData();
    const { username, password } = JSON.parse(JSON.stringify(body));
    console.log(body);
    const valid = login(username, password);
    return valid ? new Response(Bun.file('app/ui/chat.html'))
        : new Response('Invalid credentials!');
}
