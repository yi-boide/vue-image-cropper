/*
 * @Author: Marvin 454846659@qq.com
 * @Date: 2023-10-20 15:27:55
 * @LastEditors: Marvin 454846659@qq.com
 * @LastEditTime: 2023-11-09 19:08:27
 * @FilePath: /vue-image-cropper/scripts/generate-types.cjs
 * @Description:
 *
 * Copyright (c) 2023 by Marvin, All Rights Reserved.
 */
const path = require("path");
const fs = require("fs-extra");
const MarkdownIt = require("markdown-it");
const config = require("../package.json");

const TYPE_IDENTIFY_OPEN = "tbody_open";
const TYPE_IDENTIFY_CLOSE = "tbody_close";
const TR_TYPE_IDENTIFY_OPEN = "tr_open";
const TR_TYPE_IDENTIFY_CLOSE = "tr_close";
const sourceDir = path.resolve(
  __dirname,
  "./../tsc/type/packages/ImageCropper"
); // 拷贝的源文件夹
const toDir = path.resolve(__dirname, "./../dist/types"); // types
const webTypes = path.resolve(__dirname, "./../dist/smartips/web-types.json"); // smartips/web-types.json
const indexDir = path.resolve(__dirname, "./../dist/types/index.d.ts"); // types/index.d.ts
const appendIndexContent = `\ndeclare module 'vue' {
  export interface GlobalComponents {
      ImageCropper: typeof import("./index.vue")["default"]
  }
}`;
const genTypes = () => {
  return new Promise((resolve, reject) => {
    fs.cp(sourceDir, toDir, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      console.log("ts types copy success");
      fs.appendFile(indexDir, appendIndexContent, (err) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        console.log("ts types append success");
        resolve();
      });
    });
  });
};

const getSubSources = (sources) => {
  let sourcesMap = [];
  const startIndex = sources.findIndex(
    (source) => source.type === TYPE_IDENTIFY_OPEN
  );
  const endIndex = sources.findIndex(
    (source) => source.type === TYPE_IDENTIFY_CLOSE
  );
  sources = sources.slice(startIndex, endIndex + 1);
  while (
    sources.filter((source) => source.type === TR_TYPE_IDENTIFY_OPEN).length
  ) {
    let trStartIndex = sources.findIndex(
      (source) => source.type === TR_TYPE_IDENTIFY_OPEN
    );
    let trEndIndex = sources.findIndex(
      (source) => source.type === TR_TYPE_IDENTIFY_CLOSE
    );
    sourcesMap.push(sources.slice(trStartIndex, trEndIndex + 1));
    sources.splice(trStartIndex, trEndIndex - trStartIndex + 1);
  }
  return sourcesMap;
};

const genaratorWebTypes = () => {
  let attributes = [];
  const data = fs.readFileSync(path.resolve(__dirname, "../README.md"), "utf8");
  const md = new MarkdownIt();
  const sources = md.parse(data, {});
  let sourcesMap = getSubSources(sources);
  for (let sourceMap of sourcesMap) {
    const inlineItem = sourceMap.filter((source) => source.type === "inline")
      .length
      ? sourceMap.filter((source) => source.type === "inline")
      : [];
    const propItem = inlineItem.length
      ? `${inlineItem[0]?.content?.replace(/`.*?`/g, "")}`
      : "";
    const infoItem = inlineItem.length ? `${inlineItem[1]?.content}` : "";
    const typeItem = inlineItem.length
      ? `${inlineItem[2]?.content?.toLowerCase()}`
      : "";
    const defaultItem = inlineItem.length ? `${inlineItem[3]?.content}` : "";
    attributes.push({
      name: propItem,
      default: defaultItem,
      description: infoItem,
      value: {
        type: typeItem,
        kind: "expression",
      },
    });
  }

  return {
    $schema:
      "https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json",
    framework: "vue",
    name: "ImageCropper",
    version: config.version,
    contributions: {
      html: {
        tags: [
          {
            name: "image-cropper",
            slots: [],
            events: [],
            attributes: attributes.slice(),
          },
        ],
      },
    },
  };
};

const genWebTypes = () => {
  return new Promise((resolve) => {
    const typesData = genaratorWebTypes();
    let innerText = `${JSON.stringify(typesData, null, 2)}`;
    const distPath = path.resolve(__dirname, "./../dist");
    if (!fs.existsSync(path.join(distPath + "/smartips"))) {
      fs.mkdirSync(path.join(distPath + "/smartips"));
    }
    fs.writeFileSync(webTypes, innerText);
    console.log("create web-types.json success");
    resolve();
  });
};

const copy = () => {
  const targetPkgPath = path.resolve(__dirname, `../ImageCropper/package.json`);
  const targetPkgStr = fs.readFileSync(targetPkgPath);
  const targetPkgObj = JSON.parse(targetPkgStr);
  targetPkgObj.version = config.version;
  const copyAll = [
    fs.copy(
      path.resolve(__dirname, "../dist"),
      path.resolve(__dirname, "../ImageCropper/dist")
    ),
    fs.copy(
      path.resolve(__dirname, "../README.md"),
      path.resolve(__dirname, "../ImageCropper/README.md")
    ),
    fs.outputFile(targetPkgPath, JSON.stringify(targetPkgObj, null, 2), "utf8"),
  ];
  Promise.all(copyAll).then(() => {
    console.log(`复制成功`);
  });
};
Promise.all([
  genTypes(),
  genWebTypes(),
]).then(() => {
  copy();
})