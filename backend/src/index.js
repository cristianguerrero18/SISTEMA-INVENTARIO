import app from "./app.js"

const main = () => {
    app.listen(app.get("PORT"));
    console.log(`escuchando al puerto :  ${app.get("PORT")}` );
}

main();
