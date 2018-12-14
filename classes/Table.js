/**
 * Класс для генерации картинок с таблицами
 * @author Nikita Bersenev
 */

module.exports = class Table {
  constructor(title, data) {
    this.webshot = require("webshot");
    this.title = title;
    this.data = data;
    this.columns = Object.keys(data[0]);
  }

  async render() {
    // css
    let html = `
      <style type="text/css">
        body {
          margin: 0;
          padding: 0;
        }
        table {
          border: 1px solid #ccc;
          border-spacing: 0;
        }
        table caption {
          font-weight: bold;
          padding-bottom: 10px;
        }
        table tr th {
          background: #ebebeb;
          border: 1px solid #ccc;
          padding: 5px;
          text-align: center;
          text-shadow: 0 0 1px #fff;
        }
        table tr td {
          border: 1px solid #ccc;
          padding: 5px;
          text-align: center;
          min-width: 150px;
        }
      </style>
    `;

    html += `<body><table><caption>${this.title}</caption>`;

    // Шапка таблицы
    html += "<tr>";
    for (let key of this.columns) {
      html += `<th>${key}</th>`;
    }
    html += "</tr>";

    // Содержимое таблицы
    for (let row of this.data) {
      html += "<tr>";
      for (let column of this.columns) {
        html += `<td>${row[column]}</td>`;
      }
      html += "</tr>";
    }

    html += "</table></body>";

    const path = `${appRoot}\\reports\\${new Date().getTime()}.png`;
    const options = {
      siteType: "html",
      windowSize: {
        width: 10,
        height: 10
      },
      shotSize: {
        width: "all",
        height: "all"
      }
    };

    return new Promise((resolve, reject) => {
      this.webshot(html, path, options, err => {
        if (err) reject(err);
        else resolve(path);
      });
    });
  }
};
