import { Database } from "bun:sqlite";
const dbo = new Database("xchat.sqlite", { create: true });


export const  saveBodyToDb=async (body:any) =>{
    const tableName = 'register';
    const checkTable = dbo.prepare(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`);
        checkTable.all(tableName);
        if(!checkTable.get()){
            dbo.prepare(`CREATE TABLE ${tableName}
             (username TEXT,email TEXT,password TEXT)`).run();
            
        }else{
            const values = JSON.parse(JSON.stringify(body));
            console.log("body in db: ",values)
            const insertQuery= dbo.query(`INSERT INTO register VALUES 
            (?1,?2,?3)`);
            insertQuery.run(values.username,values.email,values.password);
            // const result = dbo.query(`SELECT * FROM ${tableName}`).get();
            // console.log("result: ",result);
        }
}
export const login = (username:string,password:string)=> {
    const result = dbo.query(`SELECT * FROM register WHERE username=(?)`).get(username);
    let valid=false;
    const res = JSON.parse(JSON.stringify(result));
    console.log("result: ",res);
    if(result){
    //     result.find((r)=>r.username===username);
       valid = res.username ===username && res?.password===password ?  true:false
    }
    return valid;
}