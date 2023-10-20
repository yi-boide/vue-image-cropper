import type { Plugin } from 'vite'
export const VitePluginStyleInject = (): Plugin => {
  let styleCode = '';
  
  return {
    name: 'vite-plugin-style-inject',
    apply: 'build', // 应用模式
    enforce: 'post', // 作用阶段
    generateBundle(_, bundle) {
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key]; // 拿到文件名对应的值
          // 判断+提取+移除
          if (chunk.type === 'asset' && chunk.fileName.includes('.css')) {
            styleCode += chunk.source;
            delete bundle[key];
          }
        }
      }
      // + 重新遍历bundle，一次遍历无法同时实现提取注入，例如'style.css'是bundle的最后一个键
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key];
          // 判断是否是JS文件名的chunk
          if (chunk.type === 'chunk' &&
            chunk.fileName.match(/.[cm]?js$/) !== null &&
            !chunk.fileName.includes('polyfill')
          ) {
            const initialCode = chunk.code; // 保存原有代码
            // 重新赋值
            chunk.code = '(function(){ try {var elementStyle = document.createElement(\'style\'); elementStyle.appendChild(document.createTextNode(';
            chunk.code += JSON.stringify(styleCode.trim());
            chunk.code += ')); ';
            chunk.code += 'document.head.appendChild(elementStyle);} catch(e) {console.error(\'vite-plugin-css-injected-by-js\', e);} })();';
            // 拼接原有代码
            chunk.code += initialCode;
            break; // 一个bundle插入一次即可
          }
        }
      }
    }
  }
}

export default VitePluginStyleInject;