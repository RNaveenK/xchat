import { saveBodyToDb } from '../db/database';

export async function handleRegistration(req: Request) {
    {
        const body = await req.formData();
        saveBodyToDb(body);
        return new Response(`<div id="#log">Successfylly register! Please login.
            <button type="submit" 
            hx-get="/signin" 
            hx-trigger="click" 
            hx-swap="outerHTML"
            >
            SignIn</button>
            </div>`);
    }
}