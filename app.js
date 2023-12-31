const path = require('path');
const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

// req.bodyにフォーム送信されたJSONデータを認識するために必要
// 実務課題03...body-parserがあれば不要
// app.use(express.json());
// app.use(express.urlencoded({
//     extended: true
// }));

app.set('view engine', 'ejs');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'express_db'
});

// mysqlからデータを持ってくる
app.get('/', (req, res) => {
  const sql = "select * from users";
  // 参考例
  const num = 10000;
  // 基礎課題
  // ==========ここから変数宣言、従来通りJavaScriptno要領で書いてください。==========
  // 基礎課題01:文字列を画面に出力しましょう。
  const str = "基礎課題01";
  // 基礎課題02:リストを画面表示
  // app.jsのここで配列を用意し、viewsフォルダのindex.ejsのscriptタグ内で画面に出力出来るように機能を作成して下さい。
  const array = ["aaa", "bbb", "ccc", "ddd", "eee"];
  // 基礎課題03:マップを画面表示
  // マップというのは配列の中にオブジェクトを設定するものになります。
  // オブジェクトを以下のように設定
  // name: s.chiba, email: s.chiba@gmail.com
  // name: t.kosuge, email: t.kosuge@gmail.com
  // name: m.chiba, email: m.chiba@gmail.com
  // name: t.suzuki, email: t.suzuki@gmail.com
  // name: t.hasegawa, email: t.hasegawa@gmail.com

  // ==========ここまでの範囲で書くようにしましょう。==========
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('index', {
      users : result,
      // 変数の宣言は以下の例の通りにしてみて下さい。
      // オブジェクトの考え方と同じで、プロパティ名: 値の形になります。値の部分は変数名を入れるようにして下さい。
      //例） numbar: num,
      number: num,
      text: str,
      list: array
    });
  });
});

app.post('/', (req, res) => {
  const sql = "INSERT INTO users SET ?"
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, "html/form.html"))
});


app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {user: result});
  });
});

app.post('/update/:id', (req, res) => {
  console.log(req.body);
  const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
  con.query(sql,req.body, function (err, result, fields) {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(
    sql, [req.params.id],
    function (err, result, fields) {
      if(err) throw err;
      console.log(result);
      res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
