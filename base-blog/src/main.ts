import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import router from "./router";
import service from "./utils/https";
import urls from "./utils/urls";
import mixin from "./mixins";
import {
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElMenu,
  ElMenuItem,
  ElRow,
  ElCol,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElLoading,
  ElTimeline,
  ElTimelineItem,
  ElCard,
  ElTag,
  ElIcon,
  ElCollapseTransition
} from 'element-plus';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import { registerMicroApps, start } from 'qiankun';
import apps from './micros/apps'
// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});


registerMicroApps(apps,
  {
    // qiankun 生命周期钩子 - 微应用加载前
    beforeLoad: (app: any) => {
      console.log("before load", app.name);
      return Promise.resolve();
    },
    // qiankun 生命周期钩子 - 微应用挂载后
    afterMount: (app: any) => {
      console.log("after mount", app.name);
      return Promise.resolve();
    },
  }
);
// 启动 qiankun
start();

const app = createApp(App)
// app.mixin(mixin);


app.component(ElButton.name, ElButton);
app.component(ElDialog.name, ElDialog);
app.component(ElForm.name, ElForm);
app.component(ElFormItem.name, ElFormItem);
app.component(ElInput.name, ElInput);
app.component(ElMessage.name, ElMessage);
app.component(ElMessageBox.name, ElMessageBox);
app.component(ElMenu.name, ElMenu);
app.component(ElMenuItem.name, ElMenuItem);
app.component(ElRow.name, ElRow);
app.component(ElCol.name, ElCol);
app.component(ElDropdownMenu.name, ElDropdownMenu);
app.component(ElTimeline.name, ElTimeline);
app.component(ElTimelineItem.name, ElTimelineItem);
app.component(ElDropdownItem.name, ElDropdownItem);
app.component(ElDropdown.name, ElDropdown);
app.component(ElCard.name, ElCard);
app.component(ElTag.name, ElTag);
app.component(ElIcon.name, ElIcon);
app.component(ElCollapseTransition.name, ElCollapseTransition);

// service.defaults.withCredentials = true;

app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$loading = ElLoading.service;
// app.config.globalProperties.productionTip = false;
app.config.globalProperties.$https = service;
app.config.globalProperties.$urls = urls;

app.use(VMdEditor);


app.use(store, key)
app.use(router)
app.mount('#app');

