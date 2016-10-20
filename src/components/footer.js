/**
 * 底部各项按钮开关的组件
 * Created by fuhuixiang on 16-10-10.
 */
"use strict";
const Vue = require('vue');
const store = require(`../store`);
const isEmpty = require(`../util/isEmptyObject`);

module.exports = Vue.extend({
    template: `<footer>
                    <section class="btn-box" v-if="bottomView">
                        <button class="dev-btn">开发</button>
                        <button class="build-btn">生产编译</button>
                    </section>
                    <section class="tools">
                        <div class="tool-btn">
                            <span class="tool-add iconfont icon-jia" @click="createProject"></span>
                            <span class="tool-del iconfont icon-jian" @click="deleteProject"></span>
                            <span class="tool-find iconfont icon-wenjianjia">
                                <input class="input-open" id="jsOpenProject" type="file" webkitdirectory multiple>
                            </span>
                            <span class="tool-setting iconfont icon-shezhi" @click="openSetting"></span>
                        </div>
                        <div class="tool-state">
                            <span class="state-text"><!--Done--></span>
                            <span class="state-running iconfont icon-yunxing"></span>
                        </div>
                    </section>
                </footer>`,
    props: ['running', 'projects'],
    data: ()=> {
        return {
            bottomView: false
        }
    },
    created: function () {
        this.bottomView = !isEmpty(this.projects);
    },
    methods: {
        openSetting: function () {
            this.$parent.showSettingView = true;
        },
        createProject: function () {
            this.$parent.createProject();
        },
        deleteProject: function () {
            let deletePath = store.taskList[store.activeProjectName]['path'];
            store.deleteProject(deletePath, (storage)=> {
                this.$parent.initView(storage.projects);
            });
        }
    }
});
