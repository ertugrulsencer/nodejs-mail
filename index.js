const http = require("http"),
  fileStream = require("fs");
const nodemailer = require("nodemailer");

const sendMail = (payload, next) => {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "trappy.online@gmail.com",
      pass: "Trappy2021",
    },
  });
  transporter.sendMail(
    {
      from: "teknoertugrul@gmail.com",
      to: payload.mail_to,
      subject: payload.mail_subject,
      text: payload.mail_content,
    },
    next
  );
};

const server = http.createServer((req, res) => {
  if (req.url == "/send-mail" && req.method == "POST") {
    let data = "";
    const obj = {
      mail_to: null,
      mail_subject: null,
      mail_content: null,
    };
    req
      .on("data", (chunk) => {
        data += encodeURI(chunk.toString().replace(" ", "%20"));
      })
      .on("end", () => {
        data = data.split("&");
        let newData = {};
        data.map((d) => {
          newObj = Object.create(obj);
          newData[d.split("=")[0]] = decodeURI(
            decodeURI(decodeURI(d.split("=")[1]))
          );
        });
        console.log(newData);
        sendMail(newData, (err, info) => {
          if (err) {
            res.end(err);
          } else {
            console.log(info);
            fileStream.readFile("./success.html", (err, data) => {
              if (err) {
                res.end(`HATA: ${err}`);
              } else {
                res.end(data);
              }
            });
          }
        });
        res.end();
      });
  } else {
    fileStream.readFile("./main.html", (err, data) => {
      if (err) return;
      res.end(data);
    });
  }
});
server.listen(8000, "localhost", (err) => {
  console.log(err || "E");
});
