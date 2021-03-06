/**
 * 从初始化文件夹中复制出需要用到的html，scss和js文件
 * 这个命令只在初始化一个项目时使用，需要本地模板文件支持，其他同事请无视这条命令，谢谢！
 * Created by jonnyf on 16-8-26.
 */
'use strict';
const fs            = require("fs"),
      path          = require('path'),
      core          = require('gulp'),
      replacePlugin = require('gulp-replace-pro'),
      renamePlugin  = require('../util/rename'),
      mkdirs        = require('../util/mkdirs'),
      config        = require('../../fdflow.config.json'),
      timeFormat    = require('../util/date_format');

module.exports = (projectDir)=> {
    fs.exists(projectDir, (msg)=> {
        if (msg) {
            console.log('警告！！！您要创建的项目已经存在！');
            return null;
        } else {
            let create = createProject(projectDir, path.basename(projectDir));
            create.next();
            console.log('配置文件创建完成！！！');
            create.next();
            console.log('HTML文件创建完成！！！');
            create.next();
            console.log('样式文件创建完成！！！');
            create.next();
            console.log('脚本文件创建完成！！！');
            if (create.next().done) {
                console.log(`${path.basename(projectDir)}项目创建完成！！！`);
            }
        }
    });
};

function* createProject(devDir, name) {

    let letterName = name.replace(/\_(\w)/g, (all, letter)=> {
        return letter.toUpperCase();
    });

    let templetPath = path.join(__dirname, '../../templates/');
    yield core.src(`${path.join(__dirname, '../../')}fdflow.config.json`)
        .pipe(core.dest(`${devDir}/`));

    yield core.src(`${templetPath}/index.html`)
        .pipe(replacePlugin({
            '@@main': name,
            '@@title': `${name}Title`
        }))
        .pipe(core.dest(`${devDir}/`));

    let styleType = config.style === 'scss' ? 'scss' : 'css';

    yield core.src(`${templetPath}/${styleType}/main.${styleType}`)
        .pipe(renamePlugin(`${name}.${styleType}`))
        .pipe(core.dest(`${devDir}/${styleType}`));

    yield core.src(`${templetPath}/js/main.tmpl`)
        .pipe(replacePlugin({
            '@@project_name': name,
            '@@author': config.author,
            '@@date': timeFormat,
            '@@project': letterName.replace(/(\w)/, v=> v.toUpperCase()),
            '@@letter': letterName
        }))
        .pipe(renamePlugin(`${name}.js`))
        .pipe(core.dest(`${devDir}/js`));

    // 创建图片和字体文件夹
    return mkdirs(path.resolve(process.cwd(), devDir), (dir)=> {
        fs.mkdirSync(`${dir}/images`);
        fs.mkdirSync(`${dir}/font`);
    });
}
