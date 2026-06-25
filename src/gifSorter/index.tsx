import { ExtensionWebExports } from "@moonlight-mod/types";

export const patches: ExtensionWebExports["patches"] = [
  {
    find: "1TOSaJsWtnhe0",
    replace: [
      {
        match: /data:\s*(\i)\s*===\s*(\i\.\i\.FAVORITES)\s*\?\s*(\i)\s*:\s*(\i)\s*,/,
        replacement: (_orig, resultType, favoritesConst, favArray, searchArray) =>
          `data: ${resultType} === ${favoritesConst} ? require("gifSorter_storage").filterByFolder(${favArray}) : ${searchArray},`
      },
      {
        match: /return null==(\i)\?/,
        replacement: (_orig, d) => `return require("gifSorter_folderBar").wrapContent(this, null==${d}?`
      },
      {
        match: /selectedGIF:this\.props\.selectedGIF\}\)/,
        replacement: () => `selectedGIF:this.props.selectedGIF}))`
      }
    ]
  },
  {
    find: "handleClickItem",
    replace: [
      {
        match: /renderExtras:\s*\(\)\s*=>\s*\(0,(\i)\.jsx\)\((\i)\.A,\{className:(\i)\.uJ,\.\.\.(\i)\}\)/,
        replacement: (_orig, createElement, y, O, o) =>
          `renderExtras: () => require("gifSorter_folderBar").renderGifExtras(${o}, (0,${createElement}.jsx)(${y}.A, {className: ${O}.uJ, ...${o}}))`
      }
    ]
  }
];

export const webpackModules: ExtensionWebExports["webpackModules"] = {
  storage: {
    dependencies: [],
    entrypoint: true
  },
  folderBar: {
    dependencies: [{ id: "react" }, { ext: "gifSorter", id: "storage" }],
    entrypoint: true
  }
};
