exports.ContactEmail = (_bodyData) => {
  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
            right: inherit;
          }
          h2 {
            color: rgb(146, 146, 146);
            font-size: 2.5em;
          }
          .text {
            border: 2px dashed rgb(146, 146, 146);
            padding: 20px;
            border-radius: 23px;
          }
        </style>
      </head>
      <body>
        <h2>hellow ${_bodyData.name} welcome to ure site</h2>
        <div class="text">
          <h4>msg :</h4>
          <p>
          hii ${_bodyData.name} , AriShop is very hepy for you to be part of the family 😁, 
          </p>
        </div>
      </body>
    </html>
  `;
};
